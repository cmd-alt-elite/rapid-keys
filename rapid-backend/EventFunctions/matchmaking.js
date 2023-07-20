export const joinRoom = (socket, data) => {
    console.log(`Joined room ${data}`);
    socket.join(data);
};

export const leaveRoom = (socket, data) => {
    console.log(`Leaving room ${data}`);
    socket.leave(data);
};