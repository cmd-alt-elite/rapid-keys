import { roomStatus, getRoomStatus } from "../utils/room-data.js";
import { ROOM_CAPACITY, GAME_DURATION, PROGRESS_UPDATE_TIMEOUT, LOBBY_WAIT_TIME } from '../utils/game-settings.js';

const getRoomPlayers = async (io, room) => {
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

export const sendProgress = (io, socket, data) => {
    socket.progress = data.progress;
};


export const startGame = (io, socket, room) => {
    roomStatus.set(room, {
        start: true,
        end: false,
    });
    io.in(room).emit('game_start', true);

    roomProgressLoop(io, socket, room);
}

export const endGame = (io, socket, room) => {
    console.log(`Ending game in room ${room}.`);
    roomStatus.set(room, {
        start: true,        
        end: true,
    });    
    io.in(room).emit('game_end', true);
}

export const roomProgressLoop = (io, socket, room) => {
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
    console.log(data);
    socket.wpm = data.wpm;

    let sockets = await io.in(data.room).fetchSockets();

    let sendLeaderboard = true;

    for (let socket of sockets) {
        if (!socket.wpm) {
            sendLeaderboard = false;
            break;
        }
    }

    if (sendLeaderboard) {
        console.log(`Sending leaderboard to room ${data.room}.`);

        let leaderboard = [];

        sockets.forEach((socket) => {
            leaderboard.push({
                id: socket.id,
                username: socket.username,
                wpm: socket.wpm
            });
        });

        leaderboard.sort((player1, player2) => {player2.wpm - player1.wpm});

        socket.in(data.room).emit('receive_stats', JSON.stringify(leaderboard));
    }
};