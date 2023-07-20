import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "localhost:3000",
      methods: ["GET", "POST"],
    },
  });

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        console.log("joined room" + data);
        socket.join(data);
    });

    socket.on('send_stats', (data) => {
        console.log(data.message + socket.id);
        io.in(data.room).emit('receive_stats', data.message, socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
})