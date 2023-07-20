import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { joinRoom, leaveRoom, findMatch } from './EventFunctions/matchmaking.js';
import { sendStats } from './EventFunctions/in-game.js';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
    },
  });

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('find_match', (data) => findMatch(io, socket, data));
    socket.on('join_room', (data) => joinRoom(socket, data));
    socket.on('leave_room', (data) => leaveRoom(socket, data));
    socket.on('send_stats', (data) => sendStats(io, socket, data));
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
})