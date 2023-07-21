import { addDoc, doc, getDocs, query, setDoc, where, orderBy, limit, QuerySnapshot } from "firebase/firestore/lite";
import { LEADERBOARD_LIMIT, multiplayerCollection } from "../utils/firebase-config.js";

export const multiplayerController = {

    saveRecord: async (req, res) => {

        let data = req.body;

        try {
            let record = new GameRecord(data.username, data.wpm);

            await addDoc(multiplayerCollection, firestoreAdapter.toFirestore(record)).then(() =>
                res.status(200).json({ message: `Multiplayer saved.`})
            ).catch((error) => 
                res.status(400).json({ error: `Error in creating multiplayer: ${error}` })
            );
        } catch (error) {
            res.status(400).json({error: `Error in parsing request: ${error}`});
        }
    },
    
    getLeaderboard: async (req, res) => {

        console.log('Called leaderboard API.');

        let lbEntries = [];

        const lbQuery = query(multiplayerCollection, orderBy("wpm", "desc"), limit(LEADERBOARD_LIMIT));

        await getDocs(lbQuery).then((querySnapshot) => {
            querySnapshot.forEach((document) => {
                lbEntries.push(document.data());
            });

            console.log(lbEntries);

            res.status(200).json({leaderboard: lbEntries});
        }).catch((error) => {
            res.status(400).json({error: `Error in getting leaderboard: ${error}`});
        });
    }
}