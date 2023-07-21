export var roomStatus = new Map();

export const getRoomStatus = (room) => {
    return roomStatus.get(room);
}