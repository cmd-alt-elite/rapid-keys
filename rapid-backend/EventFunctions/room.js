export const joinRoom = (socket, data) => {
    console.log(`Joining room ${data.room}`);
    socket.join(data.room);
};

export const leaveRoom = (socket, data) => {
    console.log(`Leaving room ${data.room}`);
    socket.leave(data.room);
};

export const sendProgress = (io, data) => {
    io.in(data.room).emit('update_progress', data);
}