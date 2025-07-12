
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GameGridProps {
  activeCell: number;
  onCellClick: (cellIndex: number) => void;
  gameActive: boolean;
  gridSize: number;
}

const GameGrid = ({ activeCell, onCellClick, gameActive, gridSize }: GameGridProps) => {
  const [feedbackCell, setFeedbackCell] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);

  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => index);

  // Create audio elements
  const playCorrectSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiR1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiQ1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBjiQ1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEVBQ==');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playIncorrectSound = () => {
    // Create a more noticeable error sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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

  const getGridSizeClass = () => {
    switch (gridSize) {
      case 3: return 'grid-cols-3 max-w-md';
      case 4: return 'grid-cols-4 max-w-lg';
      case 5: return 'grid-cols-5 max-w-xl';
      default: return 'grid-cols-3 max-w-md';
    }
  };

  return (
    <div className={`grid gap-3 mx-auto ${getGridSizeClass()}`}>
      {cells.map((cellIndex) => (
        <button
          key={cellIndex}
          onClick={() => handleCellClick(cellIndex)}
          disabled={!gameActive}
          className={cn(
            "aspect-square rounded-2xl border-4 transition-all duration-200 transform",
            "hover:scale-105 active:scale-95",
            "text-2xl font-bold shadow-lg",
            // Base styling
            activeCell === cellIndex 
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-600 text-white animate-pulse shadow-xl scale-110" 
              : "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-600 hover:from-blue-200 hover:to-blue-300",
            // Feedback styling
            feedbackCell === cellIndex && feedbackType === 'correct' && "bg-gradient-to-br from-green-400 to-green-600 border-green-700",
            feedbackCell === cellIndex && feedbackType === 'incorrect' && "bg-gradient-to-br from-red-400 to-red-600 border-red-700",
            !gameActive && "opacity-50 cursor-not-allowed"
          )}
        >
          {activeCell === cellIndex && (
            <div className="text-4xl">🎯</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default GameGrid;
