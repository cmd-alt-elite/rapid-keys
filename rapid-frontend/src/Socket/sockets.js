// import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("https://rapid-keys-back.onrender.com/");

function Sockets() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [senderReceived, setSenderReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_stats", { message, room });
  };

  useEffect(() => {
    socket.on("receive_stats", (data, id) => {
        console.log("received " + data);
        console.log("sent by  " + id);

      setMessageReceived(data);
      setSenderReceived(id);
    });
  }, [socket]);
  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
      <h1> Message Sender:</h1>
      {senderReceived}
    </div>
  );
}

export default Sockets;