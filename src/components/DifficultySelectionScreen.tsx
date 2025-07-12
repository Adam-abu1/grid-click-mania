
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Target, Flame } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionScreenProps {
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelectionScreen = ({ onSelect }: DifficultySelectionScreenProps) => {
  const difficulties = [
    {
      id: 'easy' as Difficulty,
      name: 'Easy',
      description: '3×3 Grid (9 cells)',
      icon: Target,
      color: 'from-green-400 to-green-600',
      hoverColor: 'hover:from-green-500 hover:to-green-700'
    },
    {
      id: 'medium' as Difficulty,
      name: 'Medium',
      description: '4×4 Grid (16 cells)',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      hoverColor: 'hover:from-yellow-500 hover:to-orange-600'
    },
    {
      id: 'hard' as Difficulty,
      name: 'Hard',
      description: '5×5 Grid (25 cells)',
      icon: Flame,
      color: 'from-red-400 to-red-600',
      hoverColor: 'hover:from-red-500 hover:to-red-700'
    }
  ];

  return (
    <div className="text-center">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          🎯 Target Rush
        </h1>
        <p className="text-2xl text-gray-700 font-semibold mb-2">Choose Your Difficulty</p>
        <p className="text-lg text-gray-600">
          Select the grid size that matches your skill level
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {difficulties.map((diff) => {
          const Icon = diff.icon;
          return (
            <Button
              key={diff.id}
              onClick={() => onSelect(diff.id)}
              className={`h-auto p-6 bg-gradient-to-r ${diff.color} ${diff.hoverColor} text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
              size="lg"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <Icon className="h-8 w-8" />
                  <div className="text-left">
                    <div className="text-2xl font-bold">{diff.name}</div>
                    <div className="text-lg opacity-90">{diff.description}</div>
                  </div>
                </div>
                <div className="text-3xl opacity-75">→</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelectionScreen;
