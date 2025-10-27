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
  const [adaptiveSpeed, setAdaptiveSpeed] = useState(3000); // Start at 3 seconds
  const [adaptiveSpeedIncrement, setAdaptiveSpeedIncrement] = useState(0);
  const [adaptiveCountdown, setAdaptiveCountdown] = useState<number | null>(null);
  const [distractorCells, setDistractorCells] = useState<number[]>([]);
  const [distractorsActive, setDistractorsActive] = useState(false);

  // Helper to clear adaptive timer
  const clearAdaptiveTimer = () => {
    if (adaptiveTimerId) {
      clearTimeout(adaptiveTimerId);
      setAdaptiveTimerId(null);
    }
    setAdaptiveCountdown(null);
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
      // More impactful size variation: 20px to 80px with weighted distribution
      const rand = Math.random();
      let size;
      if (rand < 0.2) {
        // 20% chance for very small (challenging)
        size = 20 + Math.floor(Math.random() * 15); // 20-34px
      } else if (rand < 0.4) {
        // 20% chance for very large (easy)
        size = 65 + Math.floor(Math.random() * 16); // 65-80px
      } else {
        // 60% chance for medium sizes
        size = 35 + Math.floor(Math.random() * 30); // 35-64px
      }
      setTargetSize(size);
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
    setAdaptiveSpeed(3000); // Reset adaptive speed
    setAdaptiveSpeedIncrement(0);
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
      
      // Increase adaptive difficulty every 10 successful hits
      if (modifiers.adaptiveDifficulty && (score + 1) % 10 === 0) {
        setAdaptiveSpeedIncrement(prev => prev + 200); // Reduce time by 200ms every 10 hits
        const newSpeed = Math.max(1000, adaptiveSpeed - 200); // Minimum 1 second
        setAdaptiveSpeed(newSpeed);
      }
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
    setAdaptiveSpeed(3000);
    setAdaptiveSpeedIncrement(0);
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
    setAdaptiveSpeed(3000);
    setAdaptiveSpeedIncrement(0);
    clearAdaptiveTimer();
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
    setAdaptiveSpeed(3000);
    setAdaptiveSpeedIncrement(0);
    clearAdaptiveTimer();
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
    // Always clear any existing timer first
    clearAdaptiveTimer();
    setAdaptiveCountdown(null);
    
    // Only start timer if adaptive difficulty is enabled and game is active
    if (
      gameState === 'playing' &&
      modifiers.adaptiveDifficulty &&
      !paused &&
      timeLeft > 0
    ) {
      const currentSpeed = Math.max(1000, adaptiveSpeed - adaptiveSpeedIncrement);
      const startTime = Date.now();
      
      // Update countdown every 100ms
      const countdownInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, currentSpeed - elapsed);
        setAdaptiveCountdown(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          clearInterval(countdownInterval);
          setAdaptiveCountdown(null);
        }
      }, 100);
      
      // Set timeout for auto-move
      const id = setTimeout(() => {
        clearInterval(countdownInterval);
        setAdaptiveCountdown(null);
        // Penalize for missing the auto-move
        setScore(prev => Math.max(0, prev - 1));
        setCombo(0);
        // Generate new cell which will trigger this effect again
        generateNewCell();
      }, currentSpeed);
      
      setAdaptiveTimerId(id);
      
      // Cleanup function
      return () => {
        clearTimeout(id);
        clearInterval(countdownInterval);
      };
    }
  }, [activeCell, gameState, modifiers.adaptiveDifficulty, paused, timeLeft, adaptiveSpeed, adaptiveSpeedIncrement, generateNewCell]);



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
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-emerald-50 p-4 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-16 w-96 h-96 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-r from-green-300 to-teal-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {gameState === 'difficulty' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <DifficultySelectionScreen onSelect={handleDifficultySelect} />
          </div>
        )}
        
        {gameState === 'start' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <GameStartScreen onStart={startGame} />
          </div>
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
              <div className="w-full max-w-6xl mx-auto px-4">
                <GameTimer timeLeft={timeLeft} totalTime={gameDuration} />
                
                {/* Main game area with responsive layout */}
                <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mt-8">
                  {/* Left side - Score */}
                  <div className="flex flex-col items-center lg:items-end lg:w-48 order-1 lg:order-1">
                    <ScoreDisplay score={score} showAnimation={showScoreAnimation} />
                  </div>
                  
                  {/* Center - Game Grid */}
                  <div className="flex-shrink-0 order-2 lg:order-2">
                    <div className="relative">
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
                  
                                     {/* Right side - Combo/Bonus Area */}
                   <div className="flex flex-col items-center lg:items-start lg:w-48 order-3 lg:order-3">
                     {/* Adaptive Countdown */}
                     <div className="min-h-[2.5rem] w-full">
                       {modifiers.adaptiveDifficulty && adaptiveCountdown !== null && adaptiveCountdown > 0 ? (
                         <div className="text-lg font-bold text-red-500 animate-pulse text-center lg:text-left w-full">
                           Auto-move in {adaptiveCountdown}s
                         </div>
                       ) : (
                         <div className="invisible text-lg font-bold text-center lg:text-left w-full">Auto-move</div>
                       )}
                     </div>
                     {/* Combo/Streak Counter */}
                     <div className="min-h-[2.5rem] w-full">
                       {combo > 1 ? (
                         <div className="text-xl font-bold text-yellow-500 animate-pulse text-center lg:text-left w-full">
                           Combo x{combo}
                         </div>
                       ) : (
                         <div className="invisible text-xl font-bold text-center lg:text-left w-full">Combo x0</div>
                       )}
                     </div>
                     {/* Bonus Message */}
                     <div className="min-h-[2.5rem] w-full">
                       {bonusMessage ? (
                         <div className="text-lg font-bold text-orange-500 animate-bounce text-center lg:text-left w-full">
                           {bonusMessage}
                         </div>
                       ) : (
                         <div className="invisible text-lg font-bold text-center lg:text-left w-full">Bonus</div>
                       )}
                     </div>
                     {/* Max Combo */}
                     <div className="min-h-[1.5rem] w-full">
                       {maxCombo > 1 ? (
                         <div className="text-sm text-gray-500 text-center lg:text-left w-full">
                           Max Combo: {maxCombo}
                         </div>
                       ) : (
                         <div className="invisible text-sm text-center lg:text-left w-full">Max Combo: 0</div>
                       )}
                     </div>
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
                {modifiers.adaptiveDifficulty && (
                  <span className="ml-2 text-red-600 font-medium">
                    • Adaptive Speed: {Math.max(1, Math.round((adaptiveSpeed - adaptiveSpeedIncrement) / 1000))}s
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        
        {gameState === 'finished' && (
          <div className="flex items-center justify-center min-h-[80vh]">
            <GameResultScreen score={score} onRestart={resetToStart} />
          </div>
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
