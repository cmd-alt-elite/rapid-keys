import './App.css';
import Game from './Game/game';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" Component={Game}/>
      </Routes>
    </div>
  );
}

export default App;
