'use client';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import Card from './Card';
import styles from './PassView.module.css';

export default function PassView() {
  const { state, setState } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isViewing, setIsViewing] = useState(false);

  const currentPlayer = state.players[currentPlayerIndex];

  const handleNext = () => {
    if (isViewing) {
      // Hide card
      setIsViewing(false);
      
      // Move to next player or end phase
      if (currentPlayerIndex < state.players.length - 1) {
        setCurrentPlayerIndex(prev => prev + 1);
      } else {
        setState(prev => ({ ...prev, phase: 'NIGHT' }));
      }
    } else {
      // Reveal card
      setIsViewing(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {!isViewing ? (
          <>
            <h2>Pass phone to</h2>
            <h1 className={styles.playerName}>{currentPlayer.name}</h1>
            <p className={styles.helperText}>Make sure no one else is looking!</p>
            <button className={styles.button} onClick={handleNext}>
              I am {currentPlayer.name}, reveal my role
            </button>
          </>
        ) : (
          <>
            <h2>Your role is:</h2>
            <div className={styles.cardContainer}>
              <Card 
                role={currentPlayer.originalRole!} 
                isFlipped={true} 
              />
            </div>
            <p className={styles.helperText}>Memorize your role, then tap below to hide it.</p>
            <button className={styles.button} onClick={handleNext}>
              Hide & Pass
            </button>
          </>
        )}
      </div>
    </div>
  );
}
