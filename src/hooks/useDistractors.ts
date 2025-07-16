import { useState, useCallback } from 'react';

export function useDistractors(gridSize: number) {
  const [distractorCells, setDistractorCells] = useState<number[]>([]);
  const [distractorsActive, setDistractorsActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Call this to show distractors for 700ms
  const triggerDistractors = useCallback((activeCell: number) => {
    if (timeoutId) clearTimeout(timeoutId);
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
    const id = setTimeout(() => setDistractorsActive(false), 700);
    setTimeoutId(id);
  }, [gridSize, timeoutId]);

  // Optionally, a reset function
  const resetDistractors = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setDistractorsActive(false);
    setDistractorCells([]);
  }, [timeoutId]);

  return {
    distractorCells,
    distractorsActive,
    triggerDistractors,
    resetDistractors,
  };
} 