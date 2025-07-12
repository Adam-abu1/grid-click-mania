
import React, { useState, useEffect, useCallback } from 'react';
import GameGrid from './GameGrid';
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import GameStartScreen from './GameStartScreen';
import GameResultScreen from './GameResultScreen';
import DifficultySelectionScreen, { Difficulty, GameDuration } from './DifficultySelectionScreen';
import GameControls from './GameControls';

type GameState = 'difficulty' | 'start' | 'playing' | 'finished';

const TargetRushGame = () => {
  const [gameState, setGameState] = useState<GameState>('difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameDuration, setGameDuration] = useState<GameDuration>(120);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [activeCell, setActiveCell] = useState(0);
  const [lastCell, setLastCell] = useState(-1);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);

  // Get grid size based on difficulty
  const getGridSize = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 3;
      case 'medium': return 4;
      case 'hard': return 5;
      default: return 3;
    }
  };

  const gridSize = getGridSize(difficulty);
  const totalCells = gridSize * gridSize;

  // Generate new random cell position (avoiding the same cell twice in a row)
  const generateNewCell = useCallback(() => {
    let newCell;
    do {
      newCell = Math.floor(Math.random() * totalCells);
    } while (newCell === lastCell && lastCell !== -1);
    
    setLastCell(activeCell);
    setActiveCell(newCell);
  }, [activeCell, lastCell, totalCells]);

  // Handle difficulty and duration selection
  const handleDifficultySelect = (selectedDifficulty: Difficulty, selectedDuration: GameDuration) => {
    setDifficulty(selectedDifficulty);
    setGameDuration(selectedDuration);
    setTimeLeft(selectedDuration);
    setGameState('start');
  };

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(gameDuration);
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

  // Restart game (stay in same difficulty)
  const restartGame = () => {
    setScore(0);
    setTimeLeft(gameDuration);
    setActiveCell(0);
    setLastCell(-1);
    startGame();
  };

  // Quit to difficulty selection
  const quitGame = () => {
    setGameState('difficulty');
    setScore(0);
    setTimeLeft(gameDuration);
    setActiveCell(0);
    setLastCell(-1);
  };

  // Reset to difficulty selection
  const resetToStart = () => {
    setGameState('difficulty');
    setScore(0);
    setTimeLeft(gameDuration);
    setActiveCell(0);
    setLastCell(-1);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-emerald-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-16 w-96 h-96 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-r from-green-300 to-teal-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        {gameState === 'difficulty' && (
          <DifficultySelectionScreen onSelect={handleDifficultySelect} />
        )}
        
        {gameState === 'start' && (
          <GameStartScreen onStart={startGame} />
        )}
        
        {gameState === 'playing' && (
          <div className="text-center">
            <GameTimer timeLeft={timeLeft} totalTime={gameDuration} />
            <ScoreDisplay score={score} showAnimation={showScoreAnimation} />
            <GameGrid 
              activeCell={activeCell}
              onCellClick={handleCellClick}
              gameActive={true}
              gridSize={gridSize}
            />
            <GameControls onRestart={restartGame} onQuit={quitGame} />
            <div className="mt-4 text-lg text-gray-600 font-medium">
              Click the target 🎯 as fast as you can!
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ({gridSize}×{gridSize}) • Duration: {gameDuration}s
            </div>
          </div>
        )}
        
        {gameState === 'finished' && (
          <GameResultScreen score={score} onRestart={resetToStart} />
        )}
      </div>
    </div>
  );
};

export default TargetRushGame;
