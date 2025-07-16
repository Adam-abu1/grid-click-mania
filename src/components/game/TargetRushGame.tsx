import React, { useState, useEffect, useCallback } from 'react';
import GameGrid from './GameGrid'; // Now resolves to ./GameGrid/index.tsx
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import GameStartScreen from './GameStartScreen';
import GameResultScreen from './GameResultScreen';
import DifficultySelectionScreen, { Difficulty, GameDuration } from './DifficultySelectionScreen';
import GameControls from './GameControls';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { GameModifiersProvider, useGameModifiers } from './GameModifiersContext';

type GameState = 'difficulty' | 'start' | 'playing' | 'finished';

const TargetRushGameInner = () => {
  const [gameState, setGameState] = useState<GameState>('difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameDuration, setGameDuration] = useState<GameDuration>(120);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [activeCell, setActiveCell] = useState(0);
  const [lastCell, setLastCell] = useState(-1);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [targetSize, setTargetSize] = useState<number>(48); // px, default size
  const [paused, setPaused] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'restart' | 'quit' | null>(null);
  const [wasPausedBeforeDialog, setWasPausedBeforeDialog] = useState(false);
  const { modifiers } = useGameModifiers();
  const [adaptiveTimerId, setAdaptiveTimerId] = useState<NodeJS.Timeout | null>(null);
  const [lastMoveWasTimer, setLastMoveWasTimer] = useState(false);
  const [distractorCells, setDistractorCells] = useState<number[]>([]);
  const [distractorsActive, setDistractorsActive] = useState(false);

  // Helper to clear adaptive timer
  const clearAdaptiveTimer = () => {
    if (adaptiveTimerId) {
      clearTimeout(adaptiveTimerId);
      setAdaptiveTimerId(null);
    }
  };

  // Helper to play error sound (same as GameGrid)
  const playDistractorErrorSound = () => {
    const audioContext = new (window.AudioContext || (window as Window & typeof globalThis).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.25);
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
  };

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
    if (modifiers.variableTarget) {
      // Random size between 32px and 64px
      setTargetSize(32 + Math.floor(Math.random() * 33));
    } else {
      setTargetSize(48);
    }
  }, [activeCell, lastCell, totalCells, modifiers.variableTarget]);

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
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(gameDuration);
    setLastCell(-1);
    setLastMoveWasTimer(false);
    generateNewCell();
  };

  // Distractors logic: On new target, show distractors if enabled
  useEffect(() => {
    setDistractorCells([]);
    setDistractorsActive(false);
    if (
      gameState === 'playing' &&
      modifiers.distractors &&
      !paused &&
      timeLeft > 0
    ) {
      // Pick 1 or 2 distractor cells (not the target)
      const total = gridSize * gridSize;
      const available = Array.from({ length: total }, (_, i) => i).filter(i => i !== activeCell);
      const count = Math.min(2, available.length);
      const chosen: number[] = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * available.length);
        chosen.push(available[idx]);
        available.splice(idx, 1);
      }
      setDistractorCells(chosen);
      setDistractorsActive(true);
      // Hide distractors after 700ms
      const timeout = setTimeout(() => setDistractorsActive(false), 700);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [activeCell, gameState, modifiers.distractors, paused, timeLeft, gridSize]);

  // Clear distractors on pause or game end
  useEffect(() => {
    if (paused || gameState !== 'playing') {
      setDistractorsActive(false);
    }
  }, [paused, gameState]);

  // Enhanced cell click handler for distractors
  const handleCellClick = (cellIndex: number) => {
    if (gameState !== 'playing') return;
    if (distractorsActive && distractorCells.includes(cellIndex)) {
      // Penalty for clicking distractor
      setScore(prev => Math.max(0, prev - 1));
      playDistractorErrorSound();
      setCombo(0);
      return;
    }
    if (cellIndex === activeCell) {
      clearAdaptiveTimer();
      setLastMoveWasTimer(false); // User-initiated move, allow timer to start again
      setScore(prev => {
        // Award bonus for every 5 streak
        const newCombo = combo + 1;
        let bonus = 0;
        if (newCombo > 0 && newCombo % 5 === 0) {
          bonus = 2; // Example: +2 bonus every 5 streak
          setBonusMessage(`Combo x${newCombo}! +${bonus} bonus!`);
          setTimeout(() => setBonusMessage(null), 1200);
        }
        return prev + 1 + bonus;
      });
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => (newCombo > max ? newCombo : max));
        return newCombo;
      });
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 300);
      generateNewCell();
    } else {
      setCombo(0); // Reset combo on miss
    }
  };

  // Restart game (stay in same difficulty)
  const restartGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(gameDuration);
    setActiveCell(0);
    setLastCell(-1);
    setPaused(false);
    startGame();
  };

  // Quit to difficulty selection
  const quitGame = () => {
    setGameState('difficulty');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(gameDuration);
    setActiveCell(0);
    setLastCell(-1);
    setPaused(false);
  };

  // Reset to difficulty selection
  const resetToStart = () => {
    setGameState('difficulty');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(gameDuration);
    setActiveCell(0);
    setLastCell(-1);
    setPaused(false);
  };

  // Intercepted handlers
  const handleRestart = () => {
    setWasPausedBeforeDialog(paused);
    setPaused(true);
    setPendingAction('restart');
    setConfirmOpen(true);
  };
  const handleQuit = () => {
    setWasPausedBeforeDialog(paused);
    setPaused(true);
    setPendingAction('quit');
    setConfirmOpen(true);
  };
  const handleConfirm = () => {
    setConfirmOpen(false);
    if (pendingAction === 'restart') restartGame();
    if (pendingAction === 'quit') quitGame();
    setPendingAction(null);
    setWasPausedBeforeDialog(false);
  };
  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingAction(null);
    setPaused(wasPausedBeforeDialog);
    setWasPausedBeforeDialog(false);
  };

  // Adaptive Difficulty: Start timer on new target
  useEffect(() => {
    clearAdaptiveTimer();
    if (
      gameState === 'playing' &&
      modifiers.adaptiveDifficulty &&
      !paused &&
      timeLeft > 0 &&
      !lastMoveWasTimer // Only start timer after user-initiated move
    ) {
      const id = setTimeout(() => {
        setLastMoveWasTimer(true); // Mark that the next move is timer-initiated
        generateNewCell();
      }, 2000);
      setAdaptiveTimerId(id);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line
  }, [activeCell, gameState, modifiers.adaptiveDifficulty, paused, timeLeft, lastMoveWasTimer]);

  // Clear adaptive timer on unmount or when game is paused/finished
  useEffect(() => {
    if (paused || gameState !== 'playing') {
      clearAdaptiveTimer();
    }
    // eslint-disable-next-line
  }, [paused, gameState]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !paused) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [gameState, timeLeft, paused]);

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
          <>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {pendingAction === 'restart' ? 'Restart Game?' : 'Quit Game?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {pendingAction === 'restart'
                      ? 'Are you sure you want to restart? Your current progress will be lost.'
                      : 'Are you sure you want to quit? Your current progress will be lost.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm}>Yes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col items-center w-full">
              <GameTimer timeLeft={timeLeft} totalTime={gameDuration} />
              <div className="flex flex-row justify-center items-start w-full max-w-4xl mx-auto">
                <div className="flex-1 flex flex-col items-center relative">
                  <ScoreDisplay score={score} showAnimation={showScoreAnimation} />
                  <div className="relative w-full">
                    <GameGrid 
                      activeCell={activeCell}
                      onCellClick={handleCellClick}
                      gameActive={!paused}
                      gridSize={gridSize}
                      variableTarget={modifiers.variableTarget}
                      targetSize={targetSize}
                      distractorCells={distractorCells}
                      distractorsActive={distractorsActive}
                    />
                    {paused && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20 rounded-2xl">
                        <span className="text-4xl font-bold text-gray-700">Paused</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start" style={{ width: '200px', minWidth: '160px', maxWidth: '220px' }}>
                  {/* Combo/Streak Counter */}
                  <div style={{ minHeight: '2.5rem' }} className="w-full">
                    {combo > 1 ? (
                      <div className="text-xl font-bold text-yellow-500 animate-pulse text-right w-full">Combo x{combo}</div>
                    ) : (
                      <div className="invisible text-xl font-bold text-right w-full">Combo x0</div>
                    )}
                  </div>
                  {/* Bonus Message */}
                  <div style={{ minHeight: '2.5rem' }} className="w-full">
                    {bonusMessage ? (
                      <div className="text-lg font-bold text-orange-500 animate-bounce text-right w-full">{bonusMessage}</div>
                    ) : (
                      <div className="invisible text-lg font-bold text-right w-full">Bonus</div>
                    )}
                  </div>
                  {/* Max Combo */}
                  <div style={{ minHeight: '1.5rem' }} className="w-full">
                    {maxCombo > 1 ? (
                      <div className="text-sm text-gray-500 text-right w-full">Max Combo: {maxCombo}</div>
                    ) : (
                      <div className="invisible text-sm text-right w-full">Max Combo: 0</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  onClick={() => setPaused(p => !p)}
                  variant="outline"
                  className="bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700 hover:text-yellow-800"
                >
                  {paused ? 'Resume' : 'Pause'}
                </Button>
                <GameControls onRestart={handleRestart} onQuit={handleQuit} />
              </div>
              <div className="mt-4 text-lg text-gray-600 font-medium">
                Click the target 🎯 as fast as you can!
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ({gridSize}×{gridSize}) • Duration: {gameDuration}s
              </div>
            </div>
          </>
        )}
        
        {gameState === 'finished' && (
          <GameResultScreen score={score} onRestart={resetToStart} />
        )}
      </div>
    </div>
  );
};

const TargetRushGame = () => (
  <GameModifiersProvider>
    <TargetRushGameInner />
  </GameModifiersProvider>
);

export default TargetRushGame;
