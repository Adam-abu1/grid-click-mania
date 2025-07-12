
import React from 'react';
import { cn } from '@/lib/utils';

interface GameGridProps {
  activeCell: number;
  onCellClick: (cellIndex: number) => void;
  gameActive: boolean;
}

const GameGrid = ({ activeCell, onCellClick, gameActive }: GameGridProps) => {
  const cells = Array.from({ length: 9 }, (_, index) => index);

  return (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
      {cells.map((cellIndex) => (
        <button
          key={cellIndex}
          onClick={() => onCellClick(cellIndex)}
          disabled={!gameActive}
          className={cn(
            "aspect-square rounded-2xl border-4 transition-all duration-200 transform",
            "hover:scale-105 active:scale-95",
            "text-2xl font-bold shadow-lg",
            activeCell === cellIndex 
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-600 text-white animate-pulse shadow-xl scale-110" 
              : "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-600 hover:from-blue-200 hover:to-blue-300",
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
