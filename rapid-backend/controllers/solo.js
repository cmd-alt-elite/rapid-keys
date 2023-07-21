import { addDoc, doc, getDocs, query, setDoc, where, orderBy, limit, QuerySnapshot } from "firebase/firestore/lite";
import { LEADERBOARD_LIMIT, soloCollection } from "../utils/firebase-config.js";

export const soloController = {

    saveRecord: async (req, res) => {

        let solo = req.body;
        
        await addDoc(soloCollection, solo).then(() =>
            res.status(200).json({ message: `Solo saved.`})
        ).catch((error) => 
            res.status(400).json({ error: `Error in creating solo: ${error}` })
        );
    },
    
    getLeaderboard: async (req, res) => {

        let lbEntries = [];

        const lbQuery = query(soloCollection, orderBy("duration"), limit(LEADERBOARD_LIMIT));

        await getDocs(lbQuery).then((querySnapshot) => {
            querySnapshot.forEach((document) => {
                lbEntries.add(document.data());
            });

            console.log(lbEntries);

            res.status(200).json({leaderboard: lbEntries});
        }).catch((error) => {
            res.status(400).json({error: error});
        });
    }
}