'use client';
import { GameProvider, useGame } from '../context/GameContext';
import SetupView from '../components/SetupView';
import PassView from '../components/PassView';
import NightView from '../components/NightView';
import DayView from '../components/DayView';
import GameOverView from '../components/GameOverView';

function GameRunner() {
  const { state } = useGame();
  
  return (
    <main>
      {state.phase === 'SETUP' && <SetupView />}
      {state.phase === 'PASS_AND_VIEW' && <PassView />}
      {state.phase === 'NIGHT' && <NightView />}
      {state.phase === 'DAY' && <DayView />}
      {state.phase === 'VOTING' && <GameOverView />}
      {state.phase === 'GAMEOVER' && <GameOverView />}
    </main>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameRunner />
    </GameProvider>
  );
}
