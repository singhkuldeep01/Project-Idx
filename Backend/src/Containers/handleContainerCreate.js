import Docker from 'dockerode';
const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
  const name     = `project-${projectId}`;
  const bindPath = `${process.cwd()}/Projects/${projectId}:/home/sandbox/app`;

  try {
    /* ───────────────────────────────────────────────────────────────
       1. Try to find an existing container by name
    ─────────────────────────────────────────────────────────────── */
    let container;
    try {
      container = docker.getContainer(name);
      const info = await container.inspect();           // throws 404 if none

      if (!info.State.Running) await container.start(); // start if stopped
      socket.emit('containerCreated', { containerId: info.Id });
    } catch (err) {
      if (err.statusCode !== 404) throw err;            // re-throw real errors

      /* ─────────────────────────────────────────────────────────────
         2. Create a new container if not found
      ───────────────────────────────────────────────────────────── */
      container = await docker.createContainer({
        Image: 'sandbox',
        name,
        Tty:  true,
        Cmd:  ['/bin/bash'],
        User: 'sandbox',
        HostConfig: {
          Binds: [bindPath],
          PortBindings: { '5173/tcp': [{ HostPort: '0' }] },
        },
        ExposedPorts: { '5173/tcp': {} },
        Env: ['HOST=0.0.0.0'],
      });
      await container.start();
      socket.emit('containerCreated', { containerId: container.id });
    }

    /* ───────────────────────────────────────────────────────────────
       3. Open an exec session and bridge I/O to the browser
    ─────────────────────────────────────────────────────────────── */
    container.exec(
      {
        Cmd: ['/bin/bash'],
        User: 'sandbox',
        WorkingDir: '/home/sandbox/app/sandbox', 
        AttachStdin:  true,
        AttachStdout: true,
        AttachStderr: true,
        Tty:  true,
      },
      (err, exec) => {
        if (err) {
          console.error('Error creating exec instance:', err);
          socket.emit('error', { message: 'Failed to attach shell' });
          return;
        }

        exec.start({ hijack: true }, (err, stream) => {
          if (err) {
            console.error('Error starting exec instance:', err);
            socket.emit('error', { message: 'Failed to start shell' });
            return;
          }

          attachStream(stream, socket);

          // forward user keystrokes to container
          socket.on('shell-input', data => {
            stream.write(data);                // ← write exactly what client sent
          });

          // clean up when socket disconnects
          socket.on('disconnect', () => {
            try { stream.end(); } catch (_) {}
          });
        });
      },
    );
  } catch (error) {
    console.error('Error creating or starting container:', error);
    socket.emit('error', { message: 'Failed to start container' });
  }
};

/* ──────────────────────────────────────────────────────────────────
   Helper: forward container stdout/stderr to the browser
────────────────────────────────────────────────────────────────── */
function attachStream(stream, socket) {
  stream.on('data', chunk => {
    socket.emit('shell-output', chunk.toString());
  });

  stream.on('error', err => {
    console.error('Stream error:', err);
    socket.emit('shell-output', `Stream error: ${err.message}`);
  });

  stream.on('end', () => {
    socket.emit('shell-output', 'Shell session ended');
  });
}
