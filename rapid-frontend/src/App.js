import './App.css';
import Game from './Game/game';

import { Routes, Route } from 'react-router-dom';
import Sockets from './Socket/sockets';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Sockets/>}/>
        <Route path="/game/:id" element={<Game/>}/>
      </Routes>
    </div>
  );
}

export default App;
