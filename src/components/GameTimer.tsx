
import React from 'react';

interface GameTimerProps {
  timeLeft: number;
  totalTime: number;
}

const GameTimer = ({ timeLeft, totalTime }: GameTimerProps) => {
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center mb-6">
      <div className="text-4xl font-bold text-purple-600 mb-2">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4">
        <div 
          className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default GameTimer;
