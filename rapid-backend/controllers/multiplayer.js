import { addDoc, doc, getDocs, query, setDoc, where, orderBy, limit, QuerySnapshot } from "firebase/firestore/lite";
import { LEADERBOARD_LIMIT, multiplayerCollection } from "../utils/firebase-config.js";

export const multiplayerController = {

    saveRecord: async (req, res) => {

        let record = req.body;
        
        await addDoc(multiplayerCollection, record).then(() =>
            res.status(200).json({ message: `Record saved.`})
        ).catch((error) => 
            res.status(400).json({ error: `Error in creating record: ${error}` })
        );
    },
    
    getLeaderboard: async (req, res) => {

        let lbEntries = [];

        const lbQuery = query(multiplayerCollection, orderBy('duration'), limit(LEADERBOARD_LIMIT));

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