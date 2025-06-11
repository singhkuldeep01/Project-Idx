import Docker from 'dockerode';
const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
  const name = `project-${projectId}`;
  const bindPath = `${process.cwd()}/Projects/${projectId}:/home/sandbox/app`;

  try {
    let container;
    try {
      // ── 1. Try to get the existing container by name
      container = docker.getContainer(name);
      const info = await container.inspect();

      // ── 2. If container exists but is not running, start it
      if (!info.State.Running) {
        await container.start();
      }

      // ── 3. Emit existing container ID
      socket.emit('containerCreated', { containerId: info.Id });
      return;
    } catch (err) {
      if (err.statusCode !== 404) throw err; // only ignore "not found"
    }

    // ── 4. Create new container if not found
    container = await docker.createContainer({
      Image: 'sandbox',
      name,
      Tty: true,
      Cmd: ['/bin/bash'],
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
  } catch (error) {
    console.error('Error creating or starting container:', error);
    socket.emit('error', { message: 'Failed to start container' });
  }
};
