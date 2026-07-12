import { useState, useRef, useEffect } from 'react';
import './ScratchReveal.css';
import Confetti from 'react-confetti';

const ANIMALS = [
  { id: 'a1', emoji: '🐶', color: '#ff7675' },
  { id: 'a2', emoji: '🐱', color: '#74b9ff' },
  { id: 'a3', emoji: '🐸', color: '#55efc4' },
  { id: 'a4', emoji: '🦊', color: '#fab1a0' },
  { id: 'a5', emoji: '🐻', color: '#ffeaa7' },
];

const ScratchReveal = ({ onBack }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    initGame();
    const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initGame = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setCurrentAnimal(randomAnimal);
    setIsRevealed(false);
    
    setTimeout(fillCanvas, 100); // Wait for render
  };

  const fillCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal resolution to match display size for crispness
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Draw "ice/frost" overlay
    ctx.globalCompositeOperation = 'source-over';
    
    // Frosty background
    ctx.fillStyle = '#dfe6e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some random "snow/ice" dots
    ctx.fillStyle = '#ffffff';
    for(let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width, 
        Math.random() * canvas.height, 
        Math.random() * 5 + 2, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
    if (isRevealed) return;
    setIsDrawing(true);
    scratch(e);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || isRevealed) return;
    scratch(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    checkRevealPercentage();
  };

  const scratch = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2); // Brush size
    ctx.fill();
  };

  const checkRevealPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;
    
    // Check alpha channel of every 4th byte
    // Optimize by skipping pixels (check every 10th pixel)
    const step = 4 * 10; 
    let checkedPixels = 0;
    
    for (let i = 3; i < pixels.length; i += step) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
      checkedPixels++;
    }
    
    const percentage = (transparentPixels / checkedPixels) * 100;
    
    // If more than 50% is revealed, consider it a win
    if (percentage > 50) {
      setIsRevealed(true);
      // Clear the rest of the canvas with a nice fade in CSS
      canvas.style.transition = 'opacity 1s';
      canvas.style.opacity = '0';
    }
  };

  return (
    <div className="scratch-container" style={{ backgroundColor: currentAnimal?.color || '#eee' }}>
      {isRevealed && <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={200} />}
      
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>⬅️</button>
        <h2 className="game-title">Limpe o Gelo!</h2>
      </div>

      <div className="scratch-area">
        {currentAnimal && (
          <div className="hidden-animal">
            {currentAnimal.emoji}
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          // Fallback touch events for better mobile support
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>

      {isRevealed && (
        <div className="victory-overlay">
          <div className="victory-card">
            <h2>Achou! 🎉</h2>
            <button className="play-again-btn" onClick={() => {
              const canvas = canvasRef.current;
              if (canvas) {
                canvas.style.transition = 'none';
                canvas.style.opacity = '1';
              }
              initGame();
            }}>
              Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchReveal;
