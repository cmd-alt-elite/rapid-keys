import io from "socket.io-client";
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './sockets.css'
import { useNavigate } from 'react-router-dom';


const options = [
  'easy', 'medium', 'hard'
];
const defaultOption = options[1];

export var nameArr = [];

export const socket = io.connect("https://rapid-keys-back.onrender.com/");

function SocketsSolo() {
  const navigate = useNavigate();

  //Room State
  const [roomvar, setRoom] = useState("");

  // Messages States
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState(options[1]);

  const makeMatch = () => {
    if(username !== ""){
      setRoom(username);
      navigate('/solo/' + username, { replace: true });
    }
  }

  const onSelect = (option) => {
    console.log('You selected ', option.label);
    setDifficulty(option.label)
    console.log(difficulty)
}

  return (
    <div className="socketWrapper">
      <div>
        <label htmlFor="">Username </label>
        <input
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          className="username-field"
        />
      </div>
      <div className="flexDiff"><label htmlFor="">Difficulty</label><div className="difficulty-dropdown"><Dropdown options={options} value={defaultOption} placeholder="Select an option" onChange={onSelect} /></div></div>
      
      <button onClick={makeMatch} className="match-button"> Start Game!</button>
      <br />
    </div>
  );
}

export default SocketsSolo;