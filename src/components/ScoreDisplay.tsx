
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  showAnimation?: boolean;
}

const ScoreDisplay = ({ score, showAnimation = false }: ScoreDisplayProps) => {
  return (
    <div className="text-center mb-6">
      <div className="text-lg font-semibold text-gray-600 mb-1">Score</div>
      <div className={`text-5xl font-bold text-green-500 ${showAnimation ? 'animate-bounce' : ''}`}>
        {score}
      </div>
    </div>
  );
};

export default ScoreDisplay;
