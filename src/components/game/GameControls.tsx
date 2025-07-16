
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
  onQuit: () => void;
}

const GameControls = ({ onRestart, onQuit }: GameControlsProps) => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <Button
        onClick={onRestart}
        variant="outline"
        className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 hover:text-blue-800"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Restart
      </Button>
      <Button
        onClick={onQuit}
        variant="outline" 
        className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700 hover:text-red-800"
      >
        <X className="mr-2 h-4 w-4" />
        Quit
      </Button>
    </div>
  );
};

export default GameControls;
