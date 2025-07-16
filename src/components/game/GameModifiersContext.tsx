import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GameModifiers {
  variableTarget: boolean;
  adaptiveDifficulty: boolean;
  distractors: boolean;
}

const defaultModifiers: GameModifiers = {
  variableTarget: false,
  adaptiveDifficulty: false,
  distractors: false,
};

interface GameModifiersContextType {
  modifiers: GameModifiers;
  setModifiers: React.Dispatch<React.SetStateAction<GameModifiers>>;
}

const GameModifiersContext = createContext<GameModifiersContextType | undefined>(undefined);

export const GameModifiersProvider = ({ children }: { children: ReactNode }) => {
  const [modifiers, setModifiers] = useState<GameModifiers>(defaultModifiers);
  return (
    <GameModifiersContext.Provider value={{ modifiers, setModifiers }}>
      {children}
    </GameModifiersContext.Provider>
  );
};

export const useGameModifiers = () => {
  const context = useContext(GameModifiersContext);
  if (!context) {
    throw new Error('useGameModifiers must be used within a GameModifiersProvider');
  }
  return context;
}; 