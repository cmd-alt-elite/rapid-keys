import { doc, getDocs, query, setDoc, where } from "firebase/firestore/lite";
import { roomsCollection } from "../utils/firebase-config.js";

export const roomController = {

    getRooms: async (req, res) => {
        let rooms = [];

        await getDocs(roomsCollection).then((querySnapshot) => {
            querySnapshot.forEach((document) => {
                rooms.push(document.data());
            });

            res.status(200).json({ rooms: rooms });
        }).catch((error) => {
            res.status(400).json({ error: `Error in getting rooms: ${error}` });
        });
    },

    createRoom: async (req, res) => {
        let room = req.body;

        const existsQuery = query(roomsCollection, where("id", "==", room.id));

        const querySnapshot = await getDocs(existsQuery);

        if (querySnapshot && querySnapshot.docs.length > 0) {
            res.status(400).json({ error: 'Error in creating room: Room already exists.' });
        } else {
            room.createdAt = new Date().toISOString();
            await setDoc(doc(roomsCollection, room.id), room).then(() =>
                res.status(200).json({ message: `Room with ID ${room.id} created.`, id: room.id })
            ).catch((error) => {
                res.status(400).json({ error: `Error in creating room: ${error}` });
            });
        }
    },

    updateRoom: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body.status;

        const existsQuery = query(roomsCollection, where("id", "==", id));

        const querySnapshot = await getDocs(existsQuery);

        if (querySnapshot && querySnapshot.docs.length == 0) {
            res.status(400).json({ error: 'Error in updating room: No room found.' });
        } else {
            let updateDetails = {};
            if (status) updateDetails.status = status;

            await setDoc(doc(roomsCollection, room.id), updateDetails, {merge: true}).then(() =>
                res.status(200).json({ message: `Room with ID ${id} updated.`, id: id })
            ).catch((error) => {
                res.status(400).json({ error: `Error in updating room: ${error}` });
            });
        }
    }
}