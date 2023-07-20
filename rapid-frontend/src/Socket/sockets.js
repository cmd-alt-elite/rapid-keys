// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './sockets.css'

const options = [
  'easy', 'medium', 'hard'
];
const defaultOption = options[1];

const socket = io.connect("https://rapid-keys-back.onrender.com/");

function Sockets() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [username, setUsername] = useState("");
  const [roomReceived, setRoomReceived] = useState("");
  let difficulty = "";

  const makeMatch = () => {
    if(username !== ""){
      socket.emit("find_match", username, difficulty);
    }
  }

  useEffect(() => {
    socket.on("receive_match", (room) => {
      console.log("room number alloted is  " + room);
      setRoom(room);
    });
  }, [socket]);

  const onSelect = (option) => {
    console.log('You selected ', option.label);
    difficulty = option;
}


  return (
    <div className="App">
      <input
        placeholder="username..."
        onChange={(event) => {
          setUsername(event.target.value);
        }}
        className="username-field"
      />
      <div className="difficulty-dropdown"><Dropdown options={options} value={defaultOption} placeholder="Select an option" onChange={onSelect} /></div>
      
      <button onClick={makeMatch} className="match-button"> Enter Matchmaking!</button>
      <h3> Alloted Room :</h3>
      {roomReceived}
    </div>
  );
}

export default Sockets;