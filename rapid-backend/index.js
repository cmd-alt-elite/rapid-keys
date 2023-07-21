import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { findMatch } from './event_functions/matchmaking.js';
import { joinRoom, leaveRoom, sendFinished, sendProgress } from './event_functions/room.js';
import roomsRoutes from './routes/rooms.js';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

app.use('/rooms', roomsRoutes);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('find_match', (data) => findMatch(io, socket, data));
  socket.on('join_room', (data) => joinRoom(io, socket, data));
  socket.on('leave_room', (data) => leaveRoom(io, socket, data));
  socket.on('send_progress', (data) => sendProgress(io, socket, data));
  socket.on('send_finished', (data) => sendFinished(io, socket, data));
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
})