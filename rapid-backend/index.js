import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { joinRoom, leaveRoom } from './EventFunctions/matchmaking.js';
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

    socket.on('join_room', joinRoom(socket, data));
    socket.on('leave_room', leaveRoom(socket, data));
    socket.on('send_stats', sendStats(io, socket, data));

    socket.on('find_match', (data) => {
        console.log(`Available rooms: ${socket.rooms}`);
    }); 
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
})