import io from "socket.io-client";
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './sockets.css'
import { useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";

const options = [
  'easy', 'medium', 'hard'
];
const defaultOption = options[1];

export var nameArr = [];

export const socket = io.connect("https://rapid-keys-back.onrender.com/");

function Sockets() {
  const navigate = useNavigate();
  //Room State
  const [roomvar, setRoom] = useState("");

  // Messages States
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState(options[1]);

  // Player State
  const [players, setPlayers] = useState("");


  const makeMatch = () => {
    console.log("matchmaking started...");
    if(username !== ""){
      localStorage.setItem("username", username);
      socket.emit("find_match", {"difficulty": difficulty, "username": username});
    }
    console.log("matchmaking ended...")
  }

  useEffect(()=>{
    if(localStorage.getItem("username")!==null){
      setUsername(localStorage.getItem("username"));
    }
  }, [])


  useEffect(() => {
    console.log("its happening")
    socket.on("receive_match", (room) => {
      console.log("room number alloted is  " + room);
      setRoom(room);
      console.log("match found!");
      socket.emit("join_room", {"room": room});
      navigate('/game/' + room, { replace: true });
    });
   
  }, [socket]);

  const onSelect = (option) => {
    console.log('You selected ', option.label);
    setDifficulty(option.label)
    console.log(difficulty)
}

const goHome = ()=>{
  navigate("/");
}

  return (
    <div className="socketWrapper">
      <div className="head">
					<h3 onClick={goHome}>rapid keys</h3>
				</div>

      <div>
        <label htmlFor="">Enter a username</label>
        <input
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          className="username-field"
          value={username}
        />
      </div>
      <div className="flexDiff"><label htmlFor="">Difficulty</label><div className="difficulty-dropdown"><Dropdown options={options} value={defaultOption} placeholder="Select an option" onChange={onSelect} /></div></div>
      <Button variant="primary" onClick = {makeMatch} className="matchmakingBtn">Start Matchmaking!</Button>
      {/* <button onClick={makeMatch} className="match-button"> Enter Matchmaking!</button> */}
      {roomvar && <div>
        <h3>Alloted Room :</h3>
        {roomvar}
      </div>}
      <br />
    </div>
  );
}

export default Sockets;