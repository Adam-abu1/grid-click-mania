
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';

interface GameResultScreenProps {
  score: number;
  onRestart: () => void;
}

const GameResultScreen = ({ score, onRestart }: GameResultScreenProps) => {
  const getPerformanceMessage = (score: number) => {
    if (score >= 100) return { message: "AMAZING! You're a Target Master! 🏆", color: "text-yellow-500" };
    if (score >= 80) return { message: "Excellent reflexes! 🌟", color: "text-purple-500" };
    if (score >= 60) return { message: "Great job! Keep practicing! 🎉", color: "text-blue-500" };
    if (score >= 40) return { message: "Good work! You're improving! 👍", color: "text-green-500" };
    if (score >= 20) return { message: "Nice try! Practice makes perfect! 🌈", color: "text-pink-500" };
    return { message: "Great start! Try again! 💪", color: "text-indigo-500" };
  };

  const performance = getPerformanceMessage(score);

  return (
    <div className="text-center">
      <div className="mb-8">
        <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Game Over!</h1>
        <div className="text-6xl font-bold text-green-500 mb-4">{score}</div>
        <p className="text-xl text-gray-600 mb-2">Targets Hit</p>
        <p className={`text-2xl font-bold ${performance.color}`}>
          {performance.message}
        </p>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-3">Your Stats:</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Total Hits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{(score / 2).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Hits per Minute</div>
          </div>
        </div>
      </div>

      <Button 
        onClick={onRestart}
        size="lg"
        className="text-2xl px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
      >
        <RotateCcw className="mr-2 h-6 w-6" />
        Play Again
      </Button>
    </div>
  );
};

export default GameResultScreen;
