import { addDoc, doc, getDocs, query, setDoc, where, orderBy, limit, QuerySnapshot } from "firebase/firestore/lite";
import { LEADERBOARD_LIMIT, soloCollection } from "../utils/firebase-config.js";
import { GameRecord, firestoreAdapter } from "../models/game-record.js";

export const soloController = {

    saveRecord: async (req, res) => {

        console.log('Called save solo record API.');

        let data = req.body;

        try {
            let record = new GameRecord(data.username, data.wpm);

            await addDoc(soloCollection, firestoreAdapter.toFirestore(record)).then(() =>
                res.status(200).json({ message: `Solo saved.`})
            ).catch((error) => 
                res.status(400).json({ error: `Error in creating solo: ${error}` })
            );
        } catch (error) {
            res.status(400).json({error: `Error in parsing request: ${error}`});
        }
    },
    
    getLeaderboard: async (req, res) => {

        console.log('Called solo leaderboard API.');

        let lbEntries = [];

        const lbQuery = query(soloCollection, orderBy("wpm", "desc"), limit(LEADERBOARD_LIMIT));

        await getDocs(lbQuery).then((querySnapshot) => {
            querySnapshot.forEach((document) => {
                lbEntries.push(document.data());
            });

            res.status(200).json({leaderboard: lbEntries});
        }).catch((error) => {
            res.status(400).json({error: `Error in getting leaderboard: ${error}`});
        });
    }
}