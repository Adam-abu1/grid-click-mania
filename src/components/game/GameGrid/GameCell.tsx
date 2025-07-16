import React from 'react';
import { cn } from '@/lib/utils';

interface GameCellProps {
  isActive: boolean;
  isDistractor: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  onClick: () => void;
  variableTarget?: boolean;
  targetSize?: number;
  disabled?: boolean;
}

const GameCell: React.FC<GameCellProps> = ({
  isActive,
  isDistractor,
  feedbackType,
  onClick,
  variableTarget = false,
  targetSize = 48,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "aspect-square w-full h-full min-w-[110px] min-h-[110px] md:min-w-[140px] md:min-h-[140px] rounded-2xl border-4 transition-all duration-200 transform flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        "text-2xl font-bold shadow-lg",
        isActive
          ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-600 text-white animate-pulse shadow-xl scale-110"
          : isDistractor
            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 border-violet-700 text-white animate-pulse shadow-xl"
            : "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-600 hover:from-blue-200 hover:to-blue-300",
        feedbackType === 'correct' && "bg-gradient-to-br from-green-400 to-green-600 border-green-700",
        feedbackType === 'incorrect' && "bg-gradient-to-br from-red-400 to-red-600 border-red-700",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isActive && (
        <span
          className="block mx-auto"
          style={variableTarget ? { fontSize: `${targetSize * 0.7}px`, transition: 'font-size 0.2s' } : {}}
        >
          🎯
        </span>
      )}
      {isDistractor && !isActive && (
        <span className="block mx-auto text-2xl" role="presentation" aria-hidden="true">✦</span>
      )}
    </button>
  );
};

export default GameCell; 