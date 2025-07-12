
import React, { useState, useEffect, useCallback } from 'react';
import GameGrid from './GameGrid';
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import GameStartScreen from './GameStartScreen';
import GameResultScreen from './GameResultScreen';

type GameState = 'start' | 'playing' | 'finished';

const TargetRushGame = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [activeCell, setActiveCell] = useState(0);
  const [lastCell, setLastCell] = useState(-1);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);

  const GAME_DURATION = 120; // 2 minutes

  // Generate new random cell position (avoiding the same cell twice in a row)
  const generateNewCell = useCallback(() => {
    let newCell;
    do {
      newCell = Math.floor(Math.random() * 9);
    } while (newCell === lastCell && lastCell !== -1);
    
    setLastCell(activeCell);
    setActiveCell(newCell);
  }, [activeCell, lastCell]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setLastCell(-1);
    generateNewCell();
  };

  // Handle cell click
  const handleCellClick = (cellIndex: number) => {
    if (gameState !== 'playing') return;
    
    if (cellIndex === activeCell) {
      setScore(prev => prev + 1);
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 300);
      generateNewCell();
    }
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  // Reset game
  const resetGame = () => {
    setGameState('start');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveCell(0);
    setLastCell(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {gameState === 'start' && (
          <GameStartScreen onStart={startGame} />
        )}
        
        {gameState === 'playing' && (
          <div className="text-center">
            <GameTimer timeLeft={timeLeft} totalTime={GAME_DURATION} />
            <ScoreDisplay score={score} showAnimation={showScoreAnimation} />
            <GameGrid 
              activeCell={activeCell}
              onCellClick={handleCellClick}
              gameActive={true}
            />
            <div className="mt-8 text-lg text-gray-600 font-medium">
              Click the target 🎯 as fast as you can!
            </div>
          </div>
        )}
        
        {gameState === 'finished' && (
          <GameResultScreen score={score} onRestart={resetGame} />
        )}
      </div>
    </div>
  );
};

export default TargetRushGame;
