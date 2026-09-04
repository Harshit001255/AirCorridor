import { io } from 'socket.io-client';
const BACKEND_URL = 'http://localhost:5000';

export const socket = io(BACKEND_URL, {
    autoConnect: true,
});