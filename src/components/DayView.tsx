'use client';
import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import styles from './DayView.module.css';

export default function DayView() {
  const { setState } = useGame();
  
  // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const endDay = () => {
    setState(prev => ({ ...prev, phase: 'VOTING' }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Day Phase</h1>
      <p className={styles.helperText}>Discuss! Who is the werewolf?</p>
      
      <div className={styles.timer}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      
      {timeLeft === 0 && <p className={styles.timeUp}>Time is up! Point and vote!</p>}

      <button className={styles.button} onClick={endDay}>
        {timeLeft > 0 ? 'End Discussion Early' : 'Proceed to Results'}
      </button>
    </div>
  );
}
