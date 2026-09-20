'use client';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { speak } from '../utils/audio';
import { RoleName } from '../types/game';
import RoleActions from './RoleActions';
import styles from './NightView.module.css';

const WAKE_ORDER: RoleName[] = ['Werewolf', 'Seer', 'Robber', 'Troublemaker'];

export default function NightView() {
  const { state, setState } = useGame();
  
  // Figure out which roles are actually in this game and need to wake up
  const activeRolesInGame = WAKE_ORDER.filter(roleName => 
    state.availableRoles.some(r => r.name === roleName)
  );

  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // We use a ref to prevent double-firing useEffect in dev mode
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    
    const startNight = async () => {
      await speak("Everyone, close your eyes.");
      // Small pause
      await new Promise(r => setTimeout(r, 2000));
      nextTurn(0);
    };
    
    startNight();
  }, []);

  const nextTurn = async (index: number) => {
    if (index >= activeRolesInGame.length) {
      await speak("Everyone, wake up!");
      setState(prev => ({ ...prev, phase: 'DAY' }));
      return;
    }

    const nextRole = activeRolesInGame[index];
    
    if (nextRole === 'Werewolf') {
      await speak("Werewolves, wake up and look for other werewolves.");
    } else {
      await speak(`${nextRole}, wake up and perform your action.`);
    }
    
    setCurrentActionIndex(index);
  };

  const handleActionComplete = async () => {
    const currentRole = activeRolesInGame[currentActionIndex];
    if (currentRole === 'Werewolf') {
      await speak("Werewolves, close your eyes.");
    } else {
      await speak(`${currentRole}, close your eyes.`);
    }
    
    setCurrentActionIndex(-1); // Hide UI
    await new Promise(r => setTimeout(r, 1500)); // Pause before next role
    nextTurn(currentActionIndex + 1);
  };

  if (currentActionIndex === -1) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Night Phase</h1>
        <p className={styles.helperText}>Close your eyes...</p>
      </div>
    );
  }

  const activeRoleName = activeRolesInGame[currentActionIndex];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{activeRoleName}'s Turn</h1>
      <RoleActions 
        roleName={activeRoleName} 
        onComplete={handleActionComplete} 
      />
    </div>
  );
}
