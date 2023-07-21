import './App.css';
import Landing from './Landing/landing';
import Sockets from './Socket/sockets';
import Game from './Game/game';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing/>}/>
        <Route exact path="/online" element={<Sockets/>}/>
        <Route path="/game/:id" element={<Game/>}/>
      </Routes>
    </div>
  );
}

export default App;
