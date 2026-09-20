'use client';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { speak } from '../utils/audio';
import { RoleName } from '../types/game';
import RoleActions from './RoleActions';
import styles from './NightView.module.css';

const WAKE_ORDER: RoleName[] = ['Werewolf', 'Seer', 'Robber', 'Troublemaker', 'Insomniac'];

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
      const werewolfCount = state.availableRoles.filter(r => r.name === 'Werewolf').length;
      if (werewolfCount === 1) {
        await speak("Werewolf, wake up. You may look at one center card.");
      } else {
        await speak("Werewolves, wake up and acknowledge your fellow werewolves.");
      }
    } else if (nextRole === 'Seer') {
      await speak("Seer, wake up. Look at one player's card or up to two center cards.");
    } else if (nextRole === 'Robber') {
      await speak("Robber, wake up. Select one player to rob, swap cards, and look at your new card.");
    } else if (nextRole === 'Troublemaker') {
      await speak("Troublemaker, wake up. Select two players to swap their cards without looking.");
    } else if (nextRole === 'Insomniac') {
      await speak("Insomniac, wake up. Look at your own card to see if your role has changed.");
    } else {
      await speak(`${nextRole}, wake up and perform your action.`);
    }
    
    setCurrentActionIndex(index);
  };

  const handleActionComplete = async () => {
    const currentRole = activeRolesInGame[currentActionIndex];
    if (currentRole === 'Werewolf') {
      const werewolfCount = state.availableRoles.filter(r => r.name === 'Werewolf').length;
      if (werewolfCount === 1) {
        await speak("Werewolf, close your eyes.");
      } else {
        await speak("Werewolves, close your eyes.");
      }
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
