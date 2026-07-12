import { useState } from 'react';
import './App.css';
import { Play } from 'lucide-react';
import BalloonPop from './games/BalloonPop/BalloonPop';
import ShapeMatch from './games/ShapeMatch/ShapeMatch';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'balloon':
        return <BalloonPop onBack={() => setCurrentGame(null)} />;
      case 'shape':
        return <ShapeMatch onBack={() => setCurrentGame(null)} />;
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
        <h1 className="title">Baby Games</h1>
        <div className="games-grid">
          <div className="game-card" onClick={() => setCurrentGame('balloon')}>
            <div className="game-icon">🎈</div>
            <h2>Pop Pop!</h2>
          </div>
          <div className="game-card" onClick={() => setCurrentGame('shape')}>
            <div className="game-icon">⭐</div>
            <h2>Shapes</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
