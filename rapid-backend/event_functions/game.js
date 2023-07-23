import { roomStatus, getRoomStatus } from "../utils/room-data.js";
import { ROOM_CAPACITY, GAME_DURATION, PROGRESS_UPDATE_TIMEOUT, LOBBY_WAIT_TIME } from '../utils/game-settings.js';
import { multiplayerController } from "../controllers/multiplayer.js";
import { GameRecord } from "../models/game-record.js";
import { getRoomPlayers } from "./room.js";
import { generateText } from "../utils/random-generator.js";

export const sendProgress = (io, socket, data) => {
    socket.progress = data.progress;
};

export const startGame = (io, socket, room) => {
    roomStatus.set(room, {
        start: true,
        end: false,
    });

    let difficulty = "";
    if (room.substring(0, 4) === 'easy') difficulty = 'easy';
    else if (room.substring(0, 4) === 'hard') difficulty = 'hard';
    else difficulty = 'medium';

    console.log(`The difficulty is ${difficulty}`);

    const randomText = generateText(difficulty);

    io.in(room).emit('game_start', randomText);

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

    console.log(`Sending leaderboard to room ${room}.`);

    let leaderboard = [];

    sockets.forEach((socket) => {
        leaderboard.push({
            id: socket.id,
            username: socket.username,
            wpm: socket.wpm,
            accuracy: socket.accuracy,
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
    socket.accuracy = data.accuracy;

    let sockets = await io.in(data.room).fetchSockets();

    console.log(`Sending stats to room ${data.room}.`);

    let stats = [];

    sockets.forEach((socket) => {
        stats.push({
            id: socket.id,
            username: socket.username,
            wpm: socket.wpm,
            accuracy: socket.accuracy,
        });
    });

    console.log(`Stats: ${JSON.stringify(stats)}`);
    io.in(data.room).emit('receive_stats', JSON.stringify(stats));

    console.log('Saving record...');
    await multiplayerController.saveRecordWithoutRequest({username: socket.username, wpm: socket.wpm});
    console.log('Record saved.');
};