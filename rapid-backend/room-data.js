import { roomProgressLoop } from "./event_functions/room.js";

export var roomStatus = new Map();

export const startGame = (io, socket, room) => {
    roomStatus.set(room, {
        start: true,
        end: false,
    });
    io.in(room).emit('game_start', true);

    roomProgressLoop(io, socket, room);
}

export const endGame = (io, socket, room) => {
    roomStatus.set(room, {
        start: true,        
        end: true,
    });
    io.in(room).emit('game_end', true);
}

export const getRoomStatus = (room) => {
    return roomStatus.get(room);
}