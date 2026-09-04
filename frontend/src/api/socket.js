import { io } from 'socket.io-client';

// Updated to port 8000 to match Uvicorn!
const BACKEND_URL = 'http://localhost:8000';

export const socket = io(BACKEND_URL, {
    autoConnect: true,
});