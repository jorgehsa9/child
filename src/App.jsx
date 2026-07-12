import { useState } from 'react';
import './App.css';
import { Play } from 'lucide-react';
import BalloonPop from './games/BalloonPop/BalloonPop';
import ShapeMatch from './games/ShapeMatch/ShapeMatch';
import packageInfo from '../package.json';

import MemoryMatch from './games/MemoryMatch/MemoryMatch';

const CATEGORIES = [
  { id: 'motor', title: 'Coordenação Motora 👐', className: 'cat-motor', games: [{ id: 'balloon', title: 'Pop Pop!', icon: '🎈' }] },
  { id: 'shapes', title: 'Formas 🔶', className: 'cat-shapes', games: [{ id: 'shape', title: 'Shapes', icon: '⭐' }] },
  { id: 'colors', title: 'Cores 🎨', className: 'cat-colors', games: [] },
  { id: 'numbers', title: 'Números 🔢', className: 'cat-numbers', games: [] },
  { id: 'letters', title: 'Letras 🔤', className: 'cat-letters', games: [] },
  { id: 'logic', title: 'Lógica 🧩', className: 'cat-logic', games: [{ id: 'memory', title: 'Memory', icon: '🧩' }] },
];

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
    <div className="app-container scroll-container">
      <div className="header-section">
        <div className="logo-container">
          <img src="/icon-192x192.png" alt="Pop Balão Logo" className="logo-image" />
          <h1 className="app-logo">Pop Balão</h1>
        </div>
        <p className="swipe-hint">Deslize para baixo 👇</p>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.id} className={`category-section ${cat.className}`}>
          <h2 className="category-title">{cat.title}</h2>
          <div className="games-grid">
            {cat.games.length > 0 ? (
              cat.games.map((game) => (
                <div key={game.id} className="game-card" onClick={() => setCurrentGame(game.id)}>
                  <div className="game-icon">{game.icon}</div>
                  <h3>{game.title}</h3>
                </div>
              ))
            ) : (
              <div className="game-card locked-card">
                <div className="game-icon">🔒</div>
                <h3>Em Breve</h3>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="footer-section">
        <div className="app-version">v{packageInfo.version}</div>
      </div>
    </div>
  );
}

export default App;
