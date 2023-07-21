import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore/lite'; 

const firebaseConfig = {
  apiKey: "AIzaSyAkQvI9hirW1via-FlTtgNm3KTtfYunnrs",
  authDomain: "rapid-keys.firebaseapp.com",
  projectId: "rapid-keys",
  storageBucket: "rapid-keys.appspot.com",
  messagingSenderId: "905500386826",
  appId: "1:905500386826:web:17e22d4a557fdc7793a1f3"
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore();

export const soloCollection = collection(database, 'Solo')
export const multiplayerCollection = collection(database, 'Multiplayer');

export const LEADERBOARD_LIMIT = 10;