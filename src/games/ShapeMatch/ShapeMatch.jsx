import { useState, useRef, useEffect } from 'react';
import './ShapeMatch.css';
import { ArrowLeft } from 'lucide-react';

const SHAPES = [
  { id: 'circle', color: '#FF6B6B', radius: '50%' },
  { id: 'square', color: '#4ECDC4', radius: '10px' },
  { id: 'triangle', color: '#FFE66D', radius: '0' },
];

const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
};

const ShapeMatch = ({ onBack }) => {
  // Shuffle targets and draggables independently
  const [targets, setTargets] = useState([]);
  const [draggables, setDraggables] = useState([]);
  const [matches, setMatches] = useState({});
  const [draggingShape, setDraggingShape] = useState(null);
  
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffledTargets = [...SHAPES].sort(() => Math.random() - 0.5);
    const shuffledDraggables = [...SHAPES].sort(() => Math.random() - 0.5);
    setTargets(shuffledTargets);
    setDraggables(shuffledDraggables);
    setMatches({});
  };

  const handlePointerDown = (e, shape) => {
    if (matches[shape.id]) return; // Already matched
    e.preventDefault();
    setDraggingShape(shape.id);
    
    // Support both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPos({ x: clientX, y: clientY });
  };

  const handlePointerMove = (e) => {
    if (!draggingShape) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPos({ x: clientX, y: clientY });
  };

  const handlePointerUp = (e) => {
    if (!draggingShape) return;
    
    // Check collision with targets
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    
    const elements = document.elementsFromPoint(clientX, clientY);
    const targetEl = elements.find(el => el.classList.contains('target-hole'));
    
    if (targetEl) {
      const targetId = targetEl.getAttribute('data-id');
      if (targetId === draggingShape) {
        // Match!
        setMatches(prev => ({ ...prev, [draggingShape]: true }));
        playSuccessSound();
        
        // Check if all matched
        if (Object.keys(matches).length === SHAPES.length - 1) {
          setTimeout(initGame, 2000); // Reset game after 2 seconds
        }
      }
    }
    
    setDraggingShape(null);
  };

  // Render a shape based on its config
  const renderShape = (shape, isTarget = false) => {
    if (shape.id === 'triangle') {
      return (
        <div 
          className={`shape triangle ${isTarget ? 'target' : ''}`}
          style={{
            borderBottomColor: isTarget ? '#ddd' : shape.color
          }}
        />
      );
    }
    return (
      <div 
        className={`shape ${isTarget ? 'target' : ''}`}
        style={{
          backgroundColor: isTarget ? '#ddd' : shape.color,
          borderRadius: shape.radius
        }}
      />
    );
  };

  return (
    <div 
      className="shape-game" 
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft />
        </button>
      </div>

      <div className="targets-container">
        {targets.map(target => (
          <div 
            key={target.id} 
            className="target-hole" 
            data-id={target.id}
          >
            {renderShape(target, true)}
            {/* If matched, show the real shape inside the target */}
            {matches[target.id] && (
              <div className="matched-shape">
                {renderShape(target)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="draggables-container">
        {draggables.map(shape => (
          !matches[shape.id] && (
            <div 
              key={shape.id}
              className={`draggable-wrapper ${draggingShape === shape.id ? 'dragging' : ''}`}
              onMouseDown={(e) => handlePointerDown(e, shape)}
              onTouchStart={(e) => handlePointerDown(e, shape)}
              style={
                draggingShape === shape.id 
                  ? { position: 'fixed', left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)', zIndex: 100 } 
                  : {}
              }
            >
              {renderShape(shape)}
            </div>
          )
        ))}
      </div>
      
      {Object.keys(matches).length === SHAPES.length && (
        <div className="victory-message">Great Job!</div>
      )}
    </div>
  );
};

export default ShapeMatch;
