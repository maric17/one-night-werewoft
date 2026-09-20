'use client';
import { useGame } from '../context/GameContext';
import Card from './Card';
import styles from './GameOverView.module.css';

export default function GameOverView() {
  const { state, setState } = useGame();

  const handleRestart = () => {
    // Reset back to SETUP phase
    setState(prev => ({
      ...prev,
      phase: 'SETUP',
      players: prev.players.map(p => ({ ...p, originalRole: null, currentRole: null })),
      centerCards: [],
      // keep availableRoles so they don't have to re-select
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Over</h1>
      <p className={styles.helperText}>Here are the final roles after the night!</p>

      <div className={styles.board}>
        <div className={styles.centerCards}>
          <h3>Center Cards</h3>
          <div className={styles.cardGrid}>
            {state.centerCards.map((card, idx) => (
              <Card 
                key={`center-${idx}`} 
                role={card} 
                isFlipped={false} // Reveal all
              />
            ))}
          </div>
        </div>

        <div className={styles.playerCards}>
          <h3>Players</h3>
          <div className={styles.cardGrid}>
            {state.players.map(p => (
              <div key={p.id} className={styles.playerWrapper}>
                <Card 
                  role={p.currentRole!} 
                  isFlipped={false} // Reveal all
                />
                <span className={styles.playerNameLabel}>{p.name}</span>
                {p.currentRole?.id !== p.originalRole?.id && (
                  <span className={styles.swappedBadge}>Swapped!</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className={styles.button} onClick={handleRestart}>
        Play Again
      </button>
    </div>
  );
}
