export class GameRecord {
    constructor(username, wpm) {
        this.username = username;
        this.wpm = wpm;
    }
}

export const firestoreAdapter = {
    toFirestore: (gameRecord) => {
        return {
            username: gameRecord.username,
            wpm: gameRecord.wpm,
        };
    }, 

    fromFirestore: (data) => {
        return new GameRecord(data.username, data.wpm);
    }
}