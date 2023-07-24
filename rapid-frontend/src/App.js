import './App.css';
import Landing from './Landing/landing';
import Sockets from './Socket/sockets';
import Game from './Game/game';
import Solo from './Solo/solo';

import { Routes, Route } from 'react-router-dom';
import SocketsSolo from './Socket/sockets-solo';
import Leaderboard from './Leaderboard/leaderboard';
import SoloLeaderboard from './Leaderboard/leaderboard-solo';
import { useState } from 'react';

function App() {
  const [soloText, setSoloText] = useState();
  const [isInRoom, setIsInRoom] = useState(false);
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing/>}/>
        <Route exact path="/online" element={<Sockets setIsInRoom={setIsInRoom}/>}/>
        <Route path="/game/:id" element={<Game isInRoom={isInRoom}/>}/>
        <Route path = "/solo/" element = {<SocketsSolo setSoloText={setSoloText}/>}/>
        <Route path = "solo/:id" element = {<Solo soloText={soloText}/>}/>
        <Route path = "/leaderboard" element = {<Leaderboard/>}/>
        <Route path = "/solo-leaderboard" element = {<SoloLeaderboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
