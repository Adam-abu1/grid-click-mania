import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GameCell from './GameCell';

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

  // Feedback logic
  const handleCellClick = (cellIndex: number) => {
    if (!gameActive) return;
    const isCorrect = cellIndex === activeCell;
    setFeedbackCell(cellIndex);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => {
      setFeedbackCell(null);
      setFeedbackType(null);
    }, 200);
    onCellClick(cellIndex);
  };

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
        <GameCell
          key={cellIndex}
          isActive={activeCell === cellIndex}
          isDistractor={distractorsActive && distractorCells.includes(cellIndex)}
          feedbackType={feedbackCell === cellIndex ? feedbackType : null}
          onClick={() => handleCellClick(cellIndex)}
          variableTarget={variableTarget}
          targetSize={targetSize}
          disabled={!gameActive}
        />
      ))}
    </div>
  );
};

export default GameGrid; 