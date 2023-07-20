import { v4 as uuidv4 } from 'uuid';

const ROOM_CAPACITY = 4;

export const joinRoom = (socket, data) => {
    console.log(`Joining room ${data.room}`);
    socket.join(data.room);
};

export const leaveRoom = (socket, data) => {
    console.log(`Leaving room ${data.room}`);
    socket.leave(data.room);
};

export const findMatch = (io, socket, data) => {
    console.log(data);

    let rooms = io.sockets.adapter.rooms;
    console.log(rooms);

    let roomExists = false;

    for (let [room, players] of rooms.entries()) {
        if (room.substring(0, 5) === 'room_') {   
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
        const newRoomId = "room_" + uuidv4();
        console.log(`Generating new room with ID: ${newRoomId}`);
        socket.emit('receive_match', newRoomId);
    }
};