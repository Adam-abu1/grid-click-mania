
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  showAnimation?: boolean;
  combo?: number;
  maxCombo?: number;
}

const ScoreDisplay = ({ score, showAnimation = false, combo = 0, maxCombo = 0 }: ScoreDisplayProps) => {
  return (
    <div className="text-center mb-6">
      <div className="text-lg font-semibold text-gray-600 mb-1">Score</div>
      <div className={`text-5xl font-bold text-green-500 ${showAnimation ? 'animate-bounce' : ''}`}>
        {score}
      </div>
      {/* Reserve space for combo text */}
      <div style={{ minHeight: '2.5rem' }}>
        {combo > 1 ? (
          <div className="text-xl font-bold text-yellow-500 mt-2 animate-pulse">Combo x{combo}</div>
        ) : (
          <div className="invisible text-xl font-bold mt-2">Combo x0</div>
        )}
      </div>
      {/* Reserve space for max combo text */}
      <div style={{ minHeight: '1.5rem' }}>
        {maxCombo > 1 ? (
          <div className="text-sm text-gray-500 mt-1">Max Combo: {maxCombo}</div>
        ) : (
          <div className="invisible text-sm mt-1">Max Combo: 0</div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
