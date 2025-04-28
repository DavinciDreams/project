import { io } from 'socket.io-client';

let socket: any;

export const initSocket = () => {
  if (!socket) {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? undefined 
      : 'http://localhost:3000';
    
    socket = io(socketUrl, {
      path: '/api/socket',
      addTrailingSlash: false,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling'],
      agent: false,
      upgrade: true,
      rejectUnauthorized: false,
      withCredentials: true,
      forceNew: true,
      timeout: 10000
    });

    socket.on('connect_error', (err: Error) => {
      console.log('Socket connection error:', err.message);
      socket.disconnect();
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};