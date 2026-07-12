import { useState } from 'react';
import './App.css';
import { Play } from 'lucide-react';
import BalloonPop from './games/BalloonPop/BalloonPop';
import ShapeMatch from './games/ShapeMatch/ShapeMatch';
import MemoryMatch from './games/MemoryMatch/MemoryMatch';
import ColorSorting from './games/ColorSorting/ColorSorting';
import FeedMonster from './games/FeedMonster/FeedMonster';
import packageInfo from '../package.json';

const CATEGORIES = [
  { id: 'motor', title: 'Coordenação Motora 👐', className: 'cat-motor', games: [{ id: 'balloon', title: 'Pop Pop!', icon: '🎈' }] },
  { id: 'shapes', title: 'Formas 🔶', className: 'cat-shapes', games: [{ id: 'shape', title: 'Shapes', icon: '⭐' }] },
  { id: 'colors', title: 'Cores 🎨', className: 'cat-colors', games: [{ id: 'color', title: 'Separador', icon: '🍎' }] },
  { id: 'numbers', title: 'Números 🔢', className: 'cat-numbers', games: [{ id: 'monster', title: 'Monstro', icon: '👾' }] },
  { id: 'letters', title: 'Letras 🔤', className: 'cat-letters', games: [] },
  { id: 'logic', title: 'Lógica 🧩', className: 'cat-logic', games: [{ id: 'memory', title: 'Memory', icon: '🧩' }] },
];

function App() {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'balloon':
        return <BalloonPop onBack={() => setCurrentGame(null)} />;
      case 'shape':
        return <ShapeMatch onBack={() => setCurrentGame(null)} />;
      case 'memory':
        return <MemoryMatch onBack={() => setCurrentGame(null)} />;
      case 'color':
        return <ColorSorting onBack={() => setCurrentGame(null)} />;
      case 'monster':
        return <FeedMonster onBack={() => setCurrentGame(null)} />;
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

  if (currentCategory) {
    const cat = CATEGORIES.find(c => c.id === currentCategory);
    return (
      <div className={`app-container category-page ${cat.className}`}>
        <div className="game-header">
          <button className="back-btn" onClick={() => setCurrentCategory(null)}>
            ⬅️
          </button>
        </div>
        <h2 className="category-page-title">{cat.title}</h2>
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
    );
  }

  return (
    <div className="app-container home-page">
      <div className="header-section-compact">
        <div className="logo-container-compact">
          <img src="/icon-192x192.png" alt="Pop Balão Logo" className="logo-image-compact" />
          <h1 className="app-logo-compact">Pop Balão</h1>
        </div>
      </div>

      <div className="home-categories-grid">
        {CATEGORIES.map((cat) => {
          const emoji = cat.title.slice(-2).trim();
          const name = cat.title.slice(0, -2).trim();
          return (
            <div key={cat.id} className={`home-category-card ${cat.className}`} onClick={() => setCurrentCategory(cat.id)}>
              <div className="category-emoji">{emoji}</div>
              <h2>{name}</h2>
            </div>
          );
        })}
      </div>

      <div className="footer-section-compact">
        <div className="app-version">v{packageInfo.version}</div>
      </div>
    </div>
  );
}

export default App;
