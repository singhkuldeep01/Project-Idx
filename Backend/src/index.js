import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import apiRouter from './Routes/index.js';
import chokidar from 'chokidar';
import { handleEditorEvent } from './SocketHandlers/editorHandler.js';
import { handleContainerCreate } from './Containers/handleContainerCreate.js';

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

const editorNamespace = io.of('/editor');
const terminalNamespace = io.of('/terminal');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api' , apiRouter);


terminalNamespace.on('connection', (socket) => {
  const projectId = socket.handshake.query.projectId;
  if (!projectId) {
    console.log('Project ID is required');
    socket.emit('error', { message: 'Project ID is required' });
    return;
  }
  // Here you would set up your terminal logic, e.g., spawning a shell
  // For demonstration, we will just echo back the input

  // socket.emit('shell-output', 'Welcome to the terminal! Type your commands below.');
  socket.on('shell-input', (data) => {
    // Process the input data and send output back
    socket.emit('shell-output', data);
  });

  socket.on('disconnect', () => {
    // Handle disconnection logic if needed
  });

  handleContainerCreate(projectId, socket);
});

editorNamespace.on('connection',(socket)=>{
  const projectId = socket.handshake.query.projectId;
  if(projectId){
    // Watch the project directory for changes
    // You can use the projectId to determine the path to watch
    var watcher = chokidar.watch(`./Projects/${projectId}` , {
      ignored: (path)=> path.includes('node_modules'),
      persistent: true, // Keep the watcher active 
      ignoreInitial: true, // Ignore initial add events
      awaitWriteFinish: {
        stabilityThreshold: 2000, // Wait for 2 seconds after the last write
        pollInterval: 100 // Check every 100ms
      }
    });

    watcher.on('all', (event ,path) => {
      // console.log(`File ${event} detected on path: ${path}`);
      socket.emit('fileChanged', { path });
    });
  }
  
  handleEditorEvent(socket , editorNamespace);

  socket.on('disconnect', async () => {
    if (watcher) {
      await watcher.close();
    }
  });
  

});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  });
});


server.listen(3000, () => {    
  console.log('Server is running on port 3000');
}); 