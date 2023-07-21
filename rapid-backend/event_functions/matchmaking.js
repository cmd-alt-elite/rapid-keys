import short from 'short-uuid';
import { getRoomStatus } from "../utils/room-data.js";
import { startGame } from './room.js';

import { ROOM_CAPACITY, GAME_DURATION, PROGRESS_UPDATE_TIMEOUT, LOBBY_WAIT_TIME } from '../utils/game-settings.js';

export const findMatch = (io, socket, data) => {
    // console.log(data);
    
    const difficulty = data.difficulty.toString();

    let rooms = io.sockets.adapter.rooms;
    // console.log(rooms);

    let roomExists = false;

    for (let [room, players] of rooms.entries()) {
        if (room.length === 20) continue;
        let roomStatus = getRoomStatus(room);
        if (roomStatus && roomStatus.start === true) continue;
        if (room.substring(0, difficulty.length) === difficulty) {   
            console.log(`Room ${room} has ${players.size} players`);
            
            if (players.size < ROOM_CAPACITY) {
                console.log(`Room found with available spots: ${room}`)
                socket.emit('receive_match', room);
                roomExists = true;
                break;
            }
        }
    }

    if (!roomExists) {
        console.log('No available rooms found.')
        const newRoomId = `${difficulty}_${short.generate()}`;
        console.log(`Generating new room with ID: ${newRoomId}`);
        socket.emit('receive_match', newRoomId);
        setTimeout(() => {
            let currRoomStatus = getRoomStatus(newRoomId);
            // console.log(currRoomStatus);
            if (!currRoomStatus || currRoomStatus.start === false) {
                console.log('Time up, starting game.');
                startGame(io, socket, newRoomId);
            }
        }, 1000 * LOBBY_WAIT_TIME);
    }
};