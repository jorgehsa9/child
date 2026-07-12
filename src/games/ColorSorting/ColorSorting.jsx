import { useState, useRef, useEffect } from 'react';
import './ColorSorting.css';
import Confetti from 'react-confetti';

const TOYS = [
  { id: 't1', type: 'red', emoji: '🍎' },
  { id: 't2', type: 'blue', emoji: '🐳' },
  { id: 't3', type: 'red', emoji: '🍓' },
  { id: 't4', type: 'blue', emoji: '📘' },
  { id: 't5', type: 'red', emoji: '🚗' },
  { id: 't6', type: 'blue', emoji: '🚙' },
];

const ColorSorting = ({ onBack }) => {
  const [toys, setToys] = useState(TOYS.map(t => ({ ...t, sorted: false })));
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const redBoxRef = useRef(null);
  const blueBoxRef = useRef(null);
  const dragItemRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (toys.length > 0 && toys.every(t => t.sorted)) {
      setShowConfetti(true);
    }
  }, [toys]);

  const handlePointerDown = (e, toyId) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    
    dragItemRef.current = {
      id: toyId,
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
    element.style.transform = 'scale(1.2) rotate(5deg)';
  };

  const handlePointerUp = (e) => {
    if (!dragItemRef.current) return;
    const { id, element } = dragItemRef.current;
    
    const toyRect = element.getBoundingClientRect();
    const redRect = redBoxRef.current.getBoundingClientRect();
    const blueRect = blueBoxRef.current.getBoundingClientRect();
    
    const toyCenter = {
      x: toyRect.left + toyRect.width / 2,
      y: toyRect.top + toyRect.height / 2
    };

    const isInside = (point, rect) => {
      return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
    };

    const toyData = toys.find(t => t.id === id);
    let sorted = false;

    if (toyData.type === 'red' && isInside(toyCenter, redRect)) {
      sorted = true;
    } else if (toyData.type === 'blue' && isInside(toyCenter, blueRect)) {
      sorted = true;
    }

    if (sorted) {
      setToys(prev => prev.map(t => t.id === id ? { ...t, sorted: true } : t));
    } else {
      element.style.transition = 'all 0.3s ease';
      element.style.transform = 'scale(1) rotate(0deg)';
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

  const resetGame = () => {
    setToys(TOYS.map(t => ({ ...t, sorted: false })));
    setShowConfetti(false);
  };

  const unsortedToys = toys.filter(t => !t.sorted);

  return (
    <div className="color-sorting-container">
      {showConfetti && <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={300} />}
      
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>⬅️</button>
        <h2 className="game-title">Guarde os Brinquedos!</h2>
      </div>

      <div className="toys-area">
        {unsortedToys.map((toy) => (
          <div
            key={toy.id}
            className={`toy-item ${toy.type}-toy`}
            onPointerDown={(e) => handlePointerDown(e, toy.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {toy.emoji}
          </div>
        ))}
      </div>

      <div className="boxes-area">
        <div ref={redBoxRef} className="toy-box red-box">
          <div className="box-lid"></div>
          <div className="box-front"></div>
        </div>
        <div ref={blueBoxRef} className="toy-box blue-box">
          <div className="box-lid"></div>
          <div className="box-front"></div>
        </div>
      </div>

      {showConfetti && (
        <div className="victory-overlay">
          <div className="victory-card">
            <h2>Você conseguiu! 🎉</h2>
            <button className="play-again-btn" onClick={resetGame}>Jogar Novamente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSorting;
