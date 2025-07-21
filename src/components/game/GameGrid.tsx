
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GameGridProps {
  activeCell: number;
  onCellClick: (cellIndex: number) => void;
  gameActive: boolean;
  gridSize: number;
  variableTarget?: boolean;
  targetSize?: number;
  distractorCells?: number[];
  distractorsActive?: boolean;
}

const GameGrid = ({ activeCell, onCellClick, gameActive, gridSize, variableTarget = false, targetSize = 48, distractorCells = [], distractorsActive = false }: GameGridProps) => {
  const [feedbackCell, setFeedbackCell] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);

  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => index);

  // Create audio elements
  const playCorrectSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiQ1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBQ==');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playIncorrectSound = () => {
    // Create a more noticeable error sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as Window & typeof globalThis).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleCellClick = (cellIndex: number) => {
    if (!gameActive) return;
    
    const isCorrect = cellIndex === activeCell;
    
    // Set feedback
    setFeedbackCell(cellIndex);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    
    // Play audio
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
    
    // Clear feedback after animation
    setTimeout(() => {
      setFeedbackCell(null);
      setFeedbackType(null);
    }, 200);
    
    // Call the original click handler
    onCellClick(cellIndex);
  };

  // Clear feedback when activeCell changes
  useEffect(() => {
    setFeedbackCell(null);
    setFeedbackType(null);
  }, [activeCell]);

  const getGridClasses = () => {
    switch (gridSize) {
      case 3: return {
        grid: 'grid-cols-3',
        container: 'w-[360px] max-w-[90vw]',
        gap: 'gap-4'
      };
      case 4: return {
        grid: 'grid-cols-4',
        container: 'w-[480px] max-w-[90vw]',
        gap: 'gap-3'
      };
      case 5: return {
        grid: 'grid-cols-5',
        container: 'w-[600px] max-w-[90vw]',
        gap: 'gap-2'
      };
      default: return {
        grid: 'grid-cols-3',
        container: 'w-[360px] max-w-[90vw]',
        gap: 'gap-4'
      };
    }
  };

  const gridClasses = getGridClasses();

  return (
    <div className={`grid ${gridClasses.grid} ${gridClasses.gap} ${gridClasses.container} mx-auto`}>
      {cells.map((cellIndex) => {
        const isDistractor = distractorsActive && distractorCells.includes(cellIndex);
        return (
          <button
            key={cellIndex}
            onClick={() => handleCellClick(cellIndex)}
            disabled={!gameActive}
            className={cn(
              "aspect-square w-full h-full rounded-2xl border-4 transition-all duration-200 transform flex items-center justify-center",
              "hover:scale-105 active:scale-95",
              "text-2xl font-bold shadow-lg",
              // Dynamic sizing based on grid size
              gridSize === 3 ? "min-w-[100px] min-h-[100px] sm:min-w-[110px] sm:min-h-[110px]" :
              gridSize === 4 ? "min-w-[90px] min-h-[90px] sm:min-w-[100px] sm:min-h-[100px]" :
              "min-w-[80px] min-h-[80px] sm:min-w-[90px] sm:min-h-[90px]",
              // Base styling
              activeCell === cellIndex 
                ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-600 text-white animate-pulse shadow-xl scale-110" 
                : isDistractor
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 border-violet-700 text-white animate-pulse shadow-xl"
                  : "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-600 hover:from-blue-200 hover:to-blue-300",
              // Feedback styling
              feedbackCell === cellIndex && feedbackType === 'correct' && "bg-gradient-to-br from-green-400 to-green-600 border-green-700",
              feedbackCell === cellIndex && feedbackType === 'incorrect' && "bg-gradient-to-br from-red-400 to-red-600 border-red-700",
              !gameActive && "opacity-50 cursor-not-allowed"
            )}
          >
            {activeCell === cellIndex && (
              <span
                className="block mx-auto transition-all duration-300 ease-in-out"
                style={variableTarget ? { 
                  fontSize: `${Math.max(16, targetSize * 0.8)}px`,
                  transform: targetSize < 30 ? 'scale(1.2)' : targetSize > 70 ? 'scale(0.8)' : 'scale(1)',
                  filter: targetSize < 30 ? 'brightness(1.3) drop-shadow(0 0 8px rgba(255, 255, 0, 0.8))' : 
                          targetSize > 70 ? 'brightness(0.9)' : 'none'
                } : {}}
              >
                🎯
              </span>
            )}
            {/* Optionally show a symbol for distractors */}
            {isDistractor && activeCell !== cellIndex && (
              <span className="block mx-auto text-2xl" role="presentation" aria-hidden="true">✦</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default GameGrid;
