import { roomStatus, getRoomStatus } from "../utils/room-data.js";
import { ROOM_CAPACITY, GAME_DURATION, PROGRESS_UPDATE_TIMEOUT, LOBBY_WAIT_TIME } from '../utils/game-settings.js';
import { startGame } from "./game.js";

export const getRoomPlayers = async (io, room) => {
    let players = [];

    let sockets = await io.in(room).fetchSockets();
    
    sockets.forEach(socket => {
        players.push({
            id: socket.id,
            username: socket.username,
            progress: socket.progress,
        });
    });

    // console.log(players);
    return players;
}

export const joinRoom = (io, socket, data) => {
    console.log(data);
    console.log(`Joining room ${data.room}`);
    socket.join(data.room);

    socket.progress = 0;

    getRoomPlayers(io, data.room).then((playerList) => {
        console.log('Sending players joined.');
        // console.log(JSON.stringify(playerList));
        io.in(data.room).emit('player_joined', JSON.stringify(playerList));
    });
    
    let room = io.sockets.adapter.rooms.get(data.room);
    if (room.size === ROOM_CAPACITY) {
        let currRoomStatus = getRoomStatus(data.room);
        // console.log(currRoomStatus);
        if (!currRoomStatus || currRoomStatus.start === false) {
            console.log('Room full, starting game.');
            startGame(io, socket, data.room);
        }
    }
};

export const leaveRoom = (io, socket, data) => {
    console.log(`Leaving room ${data.room}`);
    socket.leave(data.room);

};