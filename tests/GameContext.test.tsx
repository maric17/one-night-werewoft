import { render, screen } from '@testing-library/react';
import { GameProvider, useGame } from '../src/context/GameContext';
import '@testing-library/jest-dom';

const TestComponent = () => {
  const { state } = useGame();
  return <div data-testid="phase">{state.phase}</div>;
};

test('initializes with SETUP phase', () => {
  render(
    <GameProvider>
      <TestComponent />
    </GameProvider>
  );
  expect(screen.getByTestId('phase')).toHaveTextContent('SETUP');
});
