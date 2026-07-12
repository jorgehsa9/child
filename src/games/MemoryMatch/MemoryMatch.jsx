import { useState, useEffect } from 'react';
import './MemoryMatch.css';
import { ArrowLeft } from 'lucide-react';
import appleImg from '../../assets/memory/apple.png';
import puppyImg from '../../assets/memory/puppy.png';
import carImg from '../../assets/memory/car.png';
import starImg from '../../assets/memory/star.png';
import kittyImg from '../../assets/memory/kitty.png';
import frogImg from '../../assets/memory/frog.png';

const CARD_IMAGES = [
  { type: 'apple', src: appleImg },
  { type: 'puppy', src: puppyImg },
  { type: 'car', src: carImg },
  { type: 'star', src: starImg },
  { type: 'kitty', src: kittyImg },
  { type: 'frog', src: frogImg },
];

const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
};

const MemoryMatch = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // Create pairs and shuffle
    const deck = [...CARD_IMAGES, ...CARD_IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    setCards(deck);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
  };

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const firstIndex = newFlipped[0];
      const secondIndex = newFlipped[1];

      if (cards[firstIndex].type === cards[secondIndex].type) {
        // Match!
        playSuccessSound();
        setTimeout(() => {
          setSolved((prev) => [...prev, firstIndex, secondIndex]);
          setFlipped([]);
          setDisabled(false);
          
          if (solved.length + 2 === cards.length) {
            setTimeout(initGame, 3000); // Reset game after 3 seconds on win
          }
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft />
        </button>
      </div>

      <div className="memory-grid">
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={`memory-card ${flipped.includes(index) || solved.includes(index) ? 'flipped' : ''} ${solved.includes(index) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front"></div>
              <div className="memory-card-back">
                <img src={card.src} alt={card.type} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {solved.length === cards.length && cards.length > 0 && (
        <div className="victory-message">Yay!</div>
      )}
    </div>
  );
};

export default MemoryMatch;
