import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { handleSocketEvents } from './utils/socketService';
dotenv.config();
// To-do backend is not conneted till now
const PORT = Number(process.env.BACKEND_PORT) || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});


handleSocketEvents(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
