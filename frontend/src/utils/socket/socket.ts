import { io } from 'socket.io-client';
import { SocketEvents, Point } from '../../types';

interface ShapePoint extends Point {
  width?: number;
  height?: number;
  endX?: number;
  endY?: number;
  text?: string;
  fontSize?: number;
}
const socket = io('http://localhost:3001');


export const onDraw = (callback: (points: ShapePoint[]) => void) => {
  console.log('Listening for draw event');
  socket.on(SocketEvents.DRAW, callback);
};

// Function to emit draw event
export const emitDraw = (points: unknown) => {
  socket.emit(SocketEvents.DRAW, points);
};

// Function to listen for new user connections
export const onUserConnected = (callback: () => void) => {
  socket.on(SocketEvents.USER_CONNECTED, callback);
};

// Function to notify server when a user connects
export const emitUserConnected = (path: string) => {
  socket.emit(SocketEvents.USER_CONNECTED, path);
};

// Function to remove all event listeners (clean up)
export const removeSocketListeners = () => {
  socket.off(SocketEvents.DRAW);
  socket.off(SocketEvents.USER_CONNECTED);
};

export default socket;
