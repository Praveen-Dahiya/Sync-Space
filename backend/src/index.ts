import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketEvents } from './utils/socketService';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});


handleSocketEvents(io);

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
