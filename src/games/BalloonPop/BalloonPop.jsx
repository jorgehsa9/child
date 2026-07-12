import { useState, useEffect, useRef } from 'react';
import './BalloonPop.css';
import { ArrowLeft } from 'lucide-react';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', '#9D4EDD', '#06D6A0'];

// Simple oscillator sound for popping
const playPopSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn('Audio not supported', e);
  }
};

const BalloonPop = ({ onBack }) => {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);
  
  // Game loop to spawn balloons
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const id = Date.now() + Math.random();
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left = Math.random() * 80 + 10; // 10% to 90%
      const speed = Math.random() * 3 + 4; // 4s to 7s

      setBalloons(prev => [...prev, { id, color, left, speed, popped: false }]);
      
      // Auto cleanup balloons that likely went off screen
      setTimeout(() => {
        setBalloons(prev => prev.filter(b => b.id !== id));
      }, speed * 1000 + 1000);
      
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, []);

  const handlePop = (id) => {
    playPopSound();
    setScore(s => s + 1);
    
    setBalloons(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ));

    // Remove from DOM after pop animation
    setTimeout(() => {
      setBalloons(prev => prev.filter(b => b.id !== id));
    }, 300);
  };

  return (
    <div className="balloon-game" ref={containerRef}>
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft />
        </button>
        <div className="score">Score: {score}</div>
      </div>
      
      <div className="balloon-container">
        {balloons.map(balloon => (
          !balloon.popped ? (
            <div 
              key={balloon.id}
              className="balloon"
              onClick={() => handlePop(balloon.id)}
              style={{
                left: `${balloon.left}%`,
                backgroundColor: balloon.color,
                animationDuration: `${balloon.speed}s`
              }}
            >
              <div className="balloon-reflection"></div>
              <div className="balloon-knot" style={{ borderBottomColor: balloon.color }}></div>
              <div className="balloon-string"></div>
            </div>
          ) : (
            <div 
              key={balloon.id}
              className="balloon-pop-effect"
              style={{ left: `${balloon.left}%` }}
            >
              ✨
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default BalloonPop;
