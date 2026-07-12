import { useState, useRef, useEffect } from 'react';
import './FeedMonster.css';
import Confetti from 'react-confetti';

const TOTAL_APPLES = 10;

const FeedMonster = ({ onBack }) => {
  const [targetNumber, setTargetNumber] = useState(3);
  const [fedCount, setFedCount] = useState(0);
  const [apples, setApples] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [monsterEating, setMonsterEating] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const monsterMouthRef = useRef(null);
  const dragItemRef = useRef(null);

  useEffect(() => {
    initGame();
    const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initGame = () => {
    const randomTarget = Math.floor(Math.random() * 5) + 1; // 1 to 5
    setTargetNumber(randomTarget);
    setFedCount(0);
    setShowConfetti(false);
    
    const initialApples = Array.from({ length: TOTAL_APPLES }).map((_, i) => ({
      id: `apple-${i}`,
      eaten: false,
    }));
    setApples(initialApples);
  };

  useEffect(() => {
    if (fedCount > 0 && fedCount === targetNumber) {
      setTimeout(() => setShowConfetti(true), 500);
    }
  }, [fedCount, targetNumber]);

  const handlePointerDown = (e, appleId) => {
    if (fedCount >= targetNumber) return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    dragItemRef.current = {
      id: appleId,
      element: el,
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: rect.left,
      initialTop: rect.top,
    };

    el.style.position = 'fixed';
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.zIndex = 1000;
    el.style.margin = '0';
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragItemRef.current) return;
    const { element, startX, startY, initialLeft, initialTop } = dragItemRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    element.style.left = `${initialLeft + dx}px`;
    element.style.top = `${initialTop + dy}px`;
    element.style.transform = 'scale(1.2)';
  };

  const handlePointerUp = (e) => {
    if (!dragItemRef.current) return;
    const { id, element } = dragItemRef.current;
    
    const appleRect = element.getBoundingClientRect();
    const mouthRect = monsterMouthRef.current.getBoundingClientRect();
    
    const appleCenter = {
      x: appleRect.left + appleRect.width / 2,
      y: appleRect.top + appleRect.height / 2
    };

    const isInside = (point, rect) => {
      const padding = 20;
      return point.x >= rect.left - padding && point.x <= rect.right + padding && 
             point.y >= rect.top - padding && point.y <= rect.bottom + padding;
    };

    if (isInside(appleCenter, mouthRect)) {
      setApples(prev => prev.map(a => a.id === id ? { ...a, eaten: true } : a));
      setFedCount(prev => prev + 1);
      
      setMonsterEating(true);
      setTimeout(() => setMonsterEating(false), 300);
    } else {
      element.style.transition = 'all 0.3s ease';
      element.style.transform = 'scale(1)';
      element.style.position = '';
      element.style.left = '';
      element.style.top = '';
      element.style.zIndex = '';
      element.style.margin = '';
      
      setTimeout(() => {
        if (element) element.style.transition = '';
      }, 300);
    }

    element.releasePointerCapture(e.pointerId);
    dragItemRef.current = null;
  };

  return (
    <div className="feed-monster-container">
      {showConfetti && <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={300} />}
      
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>⬅️</button>
        <h2 className="game-title">Alimente o Monstro!</h2>
      </div>

      <div className="basket-area">
        <div className="apples-grid">
          {apples.map(apple => (
            !apple.eaten && (
              <div
                key={apple.id}
                className="apple-draggable"
                onPointerDown={(e) => handlePointerDown(e, apple.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                🍎
              </div>
            )
          ))}
        </div>
      </div>

      <div className="monster-area">
        <div className={`monster ${monsterEating ? 'eating' : ''}`}>
          <div className="monster-eyes">
            <div className="eye"><div className="pupil"></div></div>
            <div className="eye"><div className="pupil"></div></div>
          </div>
          <div className="monster-mouth" ref={monsterMouthRef}></div>
          <div className="monster-belly">
            <span className="target-number">{targetNumber}</span>
          </div>
        </div>
        
        <div className="progress-counter">
          {fedCount} / {targetNumber}
        </div>
      </div>

      {showConfetti && (
        <div className="victory-overlay">
          <div className="victory-card">
            <h2>Humm, que delícia! 🎉</h2>
            <button className="play-again-btn" onClick={initGame}>Dar mais maçãs</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedMonster;
