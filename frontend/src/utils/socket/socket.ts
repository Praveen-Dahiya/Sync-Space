import { io } from 'socket.io-client';
import { SocketEvents } from '../../types';
import { ShapePoint } from '../../types';

const PORT = import.meta.env.VITE_BACKEND_PORT || 3001;
console.log(import.meta.env)
const socket = io(`http://localhost:${PORT}`);

export const onDraw = (callback: (points: ShapePoint[]) => void) => {
  console.log('Listening for draw event');
  socket.on(SocketEvents.DRAW, callback);
};

export const emitDraw = (points: ShapePoint[]) => {
  socket.emit(SocketEvents.DRAW, points);
};

export const onUserConnected = (callback: () => void) => {
  socket.on(SocketEvents.USER_CONNECTED, callback);
};

export const emitUserConnected = (path: string) => {
  socket.emit(SocketEvents.USER_CONNECTED, path);
};

export const removeSocketListeners = () => {
  socket.off(SocketEvents.DRAW);
  socket.off(SocketEvents.USER_CONNECTED);
};

export default socket;
