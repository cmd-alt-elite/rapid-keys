import { ROOM_CAPACITY } from "./matchmaking.js";

export const joinRoom = (io, socket, data) => {
    console.log(`Joining room ${data.room}`);
    socket.join(data.room);
    
    let room = io.sockets.adapter.rooms.get(data.room);
    if (room.size === ROOM_CAPACITY) {
        console.log('Room full, starting game.');
        io.in(data.room).emit('game_start', true);
    }
};

export const leaveRoom = (socket, data) => {
    console.log(`Leaving room ${data.room}`);
    socket.leave(data.room);
};

export const sendProgress = (io, data) => {
    io.in(data.room).emit('update_progress', data);
}