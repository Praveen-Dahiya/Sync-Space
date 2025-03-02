import { Server, Socket } from 'socket.io';
import { SocketEvents } from '../types';

export const handleSocketEvents = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on(SocketEvents.DRAW, (points) => {
      console.log('Drawing event received', points);
      socket.broadcast.emit(SocketEvents.DRAW, points);
    });

    socket.on(SocketEvents.USER_CONNECTED, (path) => {
      console.log(`User connected to: ${path}`);
      socket.broadcast.emit(SocketEvents.USER_CONNECTED);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
