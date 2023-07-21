import { roomStatus, getRoomStatus } from "../utils/room-data.js";
import { ROOM_CAPACITY, GAME_DURATION, PROGRESS_UPDATE_TIMEOUT, LOBBY_WAIT_TIME } from '../utils/game-settings.js';
import { multiplayerController } from "../controllers/multiplayer.js";
import { GameRecord } from "../models/game-record.js";


export const sendProgress = (io, socket, data) => {
    socket.progress = data.progress;
};

export const startGame = (io, socket, room) => {
    roomStatus.set(room, {
        start: true,
        end: false,
    });
    io.in(room).emit('game_start', true);

    gameProgressLoop(io, socket, room);
}

export const endGame = async (io, socket, room) => {
    console.log(`Ending game in room ${room}.`);
    roomStatus.set(room, {
        start: true,        
        end: true,
    });    
    io.in(room).emit('game_end', true);

    let sockets = await io.in(room).fetchSockets();

    for (let socket of sockets) {
        if (!socket.wpm) {
            socket.wpm = -1;
        }
    }

    console.log(`Sending leaderboard to room ${room}.`);

    let leaderboard = [];

    sockets.forEach((socket) => {
        leaderboard.push({
            id: socket.id,
            username: socket.username,
            wpm: socket.wpm
        });
    });

    console.log(`Leaderboard: ${JSON.stringify(leaderboard)}`);
    io.in(room).emit('receive_stats', JSON.stringify(leaderboard));
}

export const gameProgressLoop = (io, socket, room) => {
    console.log('Now in room progress loop.');

    setTimeout(() => {
        endGame(io, socket, room);
    }, 1000 * GAME_DURATION);
    
    const timer = setInterval(async () => {
        
        let playerList = await getRoomPlayers(io, room);
        console.log(JSON.stringify(playerList));
        io.in(room).emit('receive_progress', JSON.stringify(playerList));
        
        let finished = true;
        
        for (var player of playerList) {
            if (parseInt(player.progress) !== 100) {
                finished = false;
                break;
            }
        }

        if (finished) {
            endGame(io, socket, room);
            clearInterval(timer);
            return;
        }

        let gameStatus = getRoomStatus(room);
        // console.log(gameStatus);

        if (gameStatus && gameStatus.end === true) {
            clearInterval(timer);
            return;
        }

    }, 1000 * PROGRESS_UPDATE_TIMEOUT);
}

export const sendStats = async (io, socket, data) => {
    socket.wpm = data.wpm;

    let sockets = await io.in(data.room).fetchSockets();

    for (let socket of sockets) {
        if (!socket.wpm) {
            socket.wpm = -1;
        }
    }

    console.log(`Sending stats to room ${data.room}.`);

    let stats = [];

    sockets.forEach((socket) => {
        stats.push({
            id: socket.id,
            username: socket.username,
            wpm: socket.wpm
        });
    });

    console.log(`Stats: ${JSON.stringify(stats)}`);
    io.in(data.room).emit('receive_stats', JSON.stringify(stats));

    console.log('Saving record...');
    let record = new GameRecord(socket.username, socket.wpm);
    await multiplayerController.saveRecord(record);
    console.log('Record saved.');
};