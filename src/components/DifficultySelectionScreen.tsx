
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Target, Flame } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameDuration = 30 | 60 | 120;

interface DifficultySelectionScreenProps {
  onSelect: (difficulty: Difficulty, duration: GameDuration) => void;
}

const DifficultySelectionScreen = ({ onSelect }: DifficultySelectionScreenProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty | null>(null);
  const [selectedDuration, setSelectedDuration] = React.useState<GameDuration | null>(null);

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

  const durations = [
    { value: 30 as GameDuration, label: '30 Seconds', description: 'Quick Practice' },
    { value: 60 as GameDuration, label: '1 Minute', description: 'Standard Game' },
    { value: 120 as GameDuration, label: '2 Minutes', description: 'Extended Challenge' }
  ];

  const handleStart = () => {
    if (selectedDifficulty && selectedDuration) {
      onSelect(selectedDifficulty, selectedDuration);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          🎯 Target Rush
        </h1>
        <p className="text-2xl text-gray-700 font-semibold mb-2">Choose Your Settings</p>
        <p className="text-lg text-gray-600">
          Select difficulty and game duration
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Difficulty Selection */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Difficulty Level</h3>
          <div className="grid gap-4 max-w-2xl mx-auto">
            {difficulties.map((diff) => {
              const Icon = diff.icon;
              const isSelected = selectedDifficulty === diff.id;
              return (
                <Button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`h-auto p-4 bg-gradient-to-r ${diff.color} ${diff.hoverColor} text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${isSelected ? 'ring-4 ring-white scale-105' : ''}`}
                  size="lg"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <Icon className="h-6 w-6" />
                      <div className="text-left">
                        <div className="text-xl font-bold">{diff.name}</div>
                        <div className="text-sm opacity-90">{diff.description}</div>
                      </div>
                    </div>
                    {isSelected && <div className="text-2xl">✓</div>}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Game Duration</h3>
          <div className="grid gap-3 max-w-lg mx-auto">
            {durations.map((duration) => {
              const isSelected = selectedDuration === duration.value;
              return (
                <Button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value)}
                  className={`h-auto p-4 transition-all duration-200 ${isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105 ring-4 ring-blue-200' 
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600'}`}
                  size="lg"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="text-lg font-bold">{duration.label}</div>
                      <div className="text-sm opacity-75">{duration.description}</div>
                    </div>
                    {isSelected && <div className="text-xl">✓</div>}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <Button
            onClick={handleStart}
            disabled={!selectedDifficulty || !selectedDuration}
            className={`h-auto p-6 text-2xl font-bold transition-all duration-200 ${
              selectedDifficulty && selectedDuration
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            size="lg"
          >
            Start Game →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelectionScreen;
