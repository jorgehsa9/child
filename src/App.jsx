import { useState } from 'react';
import './App.css';
import { Play } from 'lucide-react';
import BalloonPop from './games/BalloonPop/BalloonPop';
import ShapeMatch from './games/ShapeMatch/ShapeMatch';
import packageInfo from '../package.json';

import MemoryMatch from './games/MemoryMatch/MemoryMatch';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'balloon':
        return <BalloonPop onBack={() => setCurrentGame(null)} />;
      case 'shape':
        return <ShapeMatch onBack={() => setCurrentGame(null)} />;
      case 'memory':
        return <MemoryMatch onBack={() => setCurrentGame(null)} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return (
      <div className="app-container">
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="home-menu">
        <h1 className="app-logo">Bebi Games</h1>
        <div className="games-grid">
          <div className="game-card" onClick={() => setCurrentGame('balloon')}>
            <div className="game-icon">🎈</div>
            <h2>Pop Pop!</h2>
          </div>
          <div className="game-card" onClick={() => setCurrentGame('shape')}>
            <div className="game-icon">⭐</div>
            <h2>Shapes</h2>
          </div>
          <div className="game-card" onClick={() => setCurrentGame('memory')}>
            <div className="game-icon">🧩</div>
            <h2>Memory</h2>
          </div>
        </div>
      </div>
      <div className="app-version">v{packageInfo.version}</div>
    </div>
  );
}

export default App;
