import { io } from 'socket.io-client';

export const standbyIO = io('http://localhost:3000/stand-by', {
    autoConnect: false,
});
