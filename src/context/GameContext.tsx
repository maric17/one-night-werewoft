'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState } from '../types/game';

type GameContextType = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
};

const initialState: GameState = {
  players: [],
  availableRoles: [{ name: 'Werewolf', team: 'Werewolf', id: 'Werewolf-0' }],
  centerCards: [],
  phase: 'SETUP',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);
  return (
    <GameContext.Provider value={{ state, setState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
