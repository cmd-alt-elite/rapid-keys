// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './sockets.css'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const options = [
  'easy', 'medium', 'hard'
];
const defaultOption = options[1];

export var nameArr = [];

export const socket = io.connect("https://rapid-keys-back.onrender.com/");

function Sockets() {
  const navigate = useNavigate();

  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState(options[1]);

  const makeMatch = () => {
    console.log("matchmaking started...")
    if(username !== ""){
      socket.emit("find_match", {"difficulty": difficulty, "username": username});
    }
    console.log("matchmaking ended...")

  }

  const handleJoinRoom = ()=>{
    socket.emit("join_room", {"room": room, "username": username});
    navigate('/game/' + room, { replace: true });
  }

  useEffect(() => {
    socket.on("receive_match", (room) => {
      console.log("room number alloted is  " + room);
      setRoom(room);
      console.log("match found!");
    });
    socket.on("player_joined", (name)=>{
      console.log(name);
      nameArr.push(name);
    })
    console.log(nameArr);
  }, [socket]);

  const onSelect = (option) => {
    console.log('You selected ', option.label);
    setDifficulty(option.label)
    console.log(difficulty)
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
      {room && <div>
        <h3> Alloted Room :</h3>
        {room}
      </div>}
      <br />
      {room && <button onClick={handleJoinRoom}>Join Room</button>}
    </div>
  );
}

export default Sockets;