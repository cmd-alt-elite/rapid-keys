import short from 'short-uuid';

export const ROOM_CAPACITY = 2;
export const LOBBY_WAIT_TIME = 60;

export const findMatch = (io, socket, data) => {
    // console.log(data);

    if (data.username) socket.username = data.username;
    
    const difficulty = data.difficulty.toString();

    let rooms = io.sockets.adapter.rooms;
    // console.log(rooms);

    let roomExists = false;

    for (let [room, players] of rooms.entries()) {
        if (room.length === 20) continue;
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
            console.log('Time up, starting game.');
            socket.in(newRoomId).emit('game_start', 'Time up, start game.');
        }, 1000 * LOBBY_WAIT_TIME);
    }
};