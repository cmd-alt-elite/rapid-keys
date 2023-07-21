import { getRoomStatus, startGame } from "../room-data.js";
import { ROOM_CAPACITY } from "./matchmaking.js";

const PROGRESS_UPDATE_TIMEOUT = 2;

const getRoomPlayers = async (io, room) => {
    let players = [];

    let sockets = await io.in(room).fetchSockets();
    
    sockets.forEach(socket => {
        players.push({
            id: socket.id,
            username: socket.username,
            progress: socket.progress,
        })
    });

    // console.log(players);
    return players;
}

export const joinRoom = (io, socket, data) => {
    console.log(data);
    console.log(`Joining room ${data.room}`);
    socket.join(data.room);

    socket.username = data.username;
    socket.progress = 0;

    getRoomPlayers(io, data.room).then((playerList) => {
        console.log(JSON.stringify(playerList));
        io.in(data.room).emit('player_joined', JSON.stringify(playerList));
    });
    
    let room = io.sockets.adapter.rooms.get(data.room);
    if (room.size === ROOM_CAPACITY) {
        console.log('Room full, starting game.');
        let currRoomStatus = getRoomStatus(data.room);
        if (currRoomStatus && currRoomStatus.start === false) {
            startGame(io, socket, data.room);
        }
    }
};

export const leaveRoom = (io, socket, data) => {
    console.log(`Leaving room ${data.room}`);
    socket.leave(data.room);

};

export const sendProgress = (io, socket, data) => {
    socket.progress = data.progress;
};

export const roomProgressLoop = (io, socket, room) => {
    let gameStatus = getRoomStatus(room);
    while (gameStatus.start === true && gameStatus.end !== true) {
        setTimeout(async () => {
            let playerList = await getRoomPlayers(io, room);
            console.log(JSON.stringify(playerList));
            io.in(room).emit('receive_progress', JSON.stringify(playerList));
            gameStatus = getRoomStatus(room);
        }, 1000 * PROGRESS_UPDATE_TIMEOUT);
    }
}