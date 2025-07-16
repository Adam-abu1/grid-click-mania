
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface GameStartScreenProps {
  onStart: () => void;
}

const GameStartScreen = ({ onStart }: GameStartScreenProps) => {
  return (
    <div className="text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          🎯 Target Rush
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Click the glowing target as fast as you can! You have 2 minutes to get the highest score possible.
        </p>
      </div>
      
      <div className="mb-8 p-6 bg-blue-50 rounded-2xl max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">How to Play:</h2>
        <ul className="text-left text-blue-700 space-y-2">
          <li>• Click the target (🎯) when it appears</li>
          <li>• Target moves to a new spot after each click</li>
          <li>• Get as many clicks as possible in 2 minutes</li>
          <li>• Be quick and accurate!</li>
        </ul>
      </div>

      <Button 
        onClick={onStart}
        size="lg"
        className="text-2xl px-8 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
      >
        <Play className="mr-2 h-6 w-6" />
        Start Game
      </Button>
    </div>
  );
};

export default GameStartScreen;
