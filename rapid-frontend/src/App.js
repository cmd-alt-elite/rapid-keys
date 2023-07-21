import './App.css';
import Landing from './Landing/landing';
import Sockets from './Socket/sockets';
import Game from './Game/game';
import Solo from './Solo/solo';

import { Routes, Route } from 'react-router-dom';
import SocketsSolo from './Socket/sockets-solo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing/>}/>
        <Route exact path="/online" element={<Sockets/>}/>
        <Route path="/game/:id" element={<Game/>}/>
        <Route path = "/solo/" element = {<SocketsSolo/>}/>
        <Route path = "solo/:id" element = {<Solo/>}/>
      </Routes>
    </div>
  );
}

export default App;
