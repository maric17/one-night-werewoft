'use client';
import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { RoleName } from '../types/game';
import Card from './Card';
import styles from './RoleActions.module.css';

type RoleActionsProps = {
  roleName: RoleName;
  onComplete: () => void;
};

export default function RoleActions({ roleName, onComplete }: RoleActionsProps) {
  const { state, setState } = useGame();
  
  // Track selections for actions
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<number[]>([]);
  const [actionDone, setActionDone] = useState(false);

  // Helper to get who actually has this role right now
  const playersWithRole = state.players.filter(p => p.originalRole?.name === roleName);

  useEffect(() => {
    // If NO ONE has this role, we must auto-skip after a delay.
    // Otherwise, everyone has their eyes closed and the game will softlock forever!
    // If someone DOES have the role, we never auto-skip. They MUST click confirm.
    if (playersWithRole.length === 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, 10000); // Wait 10 seconds to fake out the players
      return () => clearTimeout(timer);
    }
  }, [playersWithRole.length, onComplete]);

  const handlePlayerClick = (playerId: string) => {
    if (actionDone) return;
    
    if (roleName === 'Seer') {
      // Seer can look at 1 player card OR 2 center cards
      if (selectedCenter.length > 0) return;
      // Prevent unselecting to stop cheating (card is revealed instantly)
      if (!selectedPlayers.includes(playerId) && selectedPlayers.length < 1) {
        setSelectedPlayers([playerId]);
      }
    } else if (roleName === 'Robber') {
      // Robber swaps with 1 player (lock in pick)
      if (!selectedPlayers.includes(playerId) && selectedPlayers.length < 1) {
        setSelectedPlayers([playerId]);
      }
    } else if (roleName === 'Troublemaker') {
      // Troublemaker swaps 2 players (lock in picks)
      if (!selectedPlayers.includes(playerId) && selectedPlayers.length < 2) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };

  const handleCenterClick = (index: number) => {
    if (actionDone) return;

    if (roleName === 'Werewolf' && playersWithRole.length <= 1) {
      // Lone werewolf can look at 1 center card (prevent unselecting to stop cheating)
      if (!selectedCenter.includes(index) && selectedCenter.length < 1) {
        setSelectedCenter([index]);
      }
    } else if (roleName === 'Seer') {
      if (selectedPlayers.length > 0) return;
      // Seer can look at up to 2 center cards (prevent unselecting)
      if (!selectedCenter.includes(index) && selectedCenter.length < 2) {
        setSelectedCenter([...selectedCenter, index]);
      }
    }
  };

  const confirmAction = () => {
    if (roleName === 'Robber' && selectedPlayers.length === 1) {
      const targetId = selectedPlayers[0];
      const robberPlayer = playersWithRole[0];
      
      setState(prev => {
        const newPlayers = [...prev.players];
        const rIndex = newPlayers.findIndex(p => p.id === robberPlayer.id);
        const tIndex = newPlayers.findIndex(p => p.id === targetId);
        
        // Swap current roles
        const temp = newPlayers[rIndex].currentRole;
        newPlayers[rIndex].currentRole = newPlayers[tIndex].currentRole;
        newPlayers[tIndex].currentRole = temp;
        
        return { ...prev, players: newPlayers };
      });
    } else if (roleName === 'Troublemaker' && selectedPlayers.length === 2) {
      setState(prev => {
        const newPlayers = [...prev.players];
        const t1Index = newPlayers.findIndex(p => p.id === selectedPlayers[0]);
        const t2Index = newPlayers.findIndex(p => p.id === selectedPlayers[1]);
        
        // Swap current roles
        const temp = newPlayers[t1Index].currentRole;
        newPlayers[t1Index].currentRole = newPlayers[t2Index].currentRole;
        newPlayers[t2Index].currentRole = temp;
        
        return { ...prev, players: newPlayers };
      });
    }

    setActionDone(true);
  };

  const getInstruction = () => {
    if (actionDone) return "Action complete. Tap Done when ready to sleep.";
    switch (roleName) {
      case 'Werewolf':
        if (playersWithRole.length <= 1) return "You are the lone werewolf! You may look at 1 center card.";
        return "Acknowledge your fellow werewolves.";
      case 'Seer':
        return "Look at 1 player's card OR up to 2 center cards.";
      case 'Robber':
        return "Select 1 player to rob (swap cards and look).";
      case 'Troublemaker':
        return "Select 2 players to swap their cards (without looking).";
      case 'Insomniac':
        return "Look at your card to see if your role changed.";
      default:
        return "";
    }
  };

  const isConfirmEnabled = () => {
    if (playersWithRole.length === 0) return true;
    if (roleName === 'Werewolf') return true; // Lone werewolf action is optional
    if (roleName === 'Seer') return selectedPlayers.length === 1 || selectedCenter.length > 0;
    if (roleName === 'Robber') return selectedPlayers.length === 1;
    if (roleName === 'Troublemaker') return selectedPlayers.length === 2;
    if (roleName === 'Insomniac') return true;
    return true;
  };

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>{getInstruction()}</p>

      <div className={styles.board}>
        <div className={styles.centerCards}>
          <h3>Center Cards</h3>
          <div className={styles.cardGrid}>
            {state.centerCards.map((card, idx) => {
              const isSelected = selectedCenter.includes(idx);
              // Face up if selected by Lone Werewolf or Seer
              const isFlipped = !((roleName === 'Werewolf' || roleName === 'Seer') && isSelected);
              
              return (
                <Card 
                  key={`center-${idx}`} 
                  role={card} 
                  isFlipped={isFlipped}
                  isSelected={isSelected}
                  onClick={() => handleCenterClick(idx)}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.playerCards}>
          <h3>Players</h3>
          <div className={styles.cardGrid}>
            {state.players.map(p => {
              const isSelected = selectedPlayers.includes(p.id);
              // Werewolves see each other
              const isFellowWerewolf = roleName === 'Werewolf' && p.originalRole?.name === 'Werewolf';
              // Seer looking at a player
              const isSeerTarget = roleName === 'Seer' && isSelected;
              // Robber looking at their new card (after confirm) which is the target's original card
              const isRobberTarget = roleName === 'Robber' && actionDone && p.id === selectedPlayers[0];
              // Insomniac sees their own card
              const isInsomniacSelf = roleName === 'Insomniac' && p.id === playersWithRole[0]?.id;
              
              const isFlipped = !(isFellowWerewolf || isSeerTarget || isRobberTarget || isInsomniacSelf);

              // Insomniac needs to see their current role. Everyone else can just show originalRole (since Robber wants to see what the target originally had).
              const roleToDisplay = isInsomniacSelf ? p.currentRole : p.originalRole;

              return (
                <div key={p.id} className={styles.playerWrapper}>
                  <Card 
                    role={roleToDisplay!} 
                    isFlipped={isFlipped}
                    isSelected={isSelected}
                    onClick={() => handlePlayerClick(p.id)}
                  />
                  <span className={styles.playerNameLabel}>{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!actionDone ? (
        <button 
          className={styles.button} 
          onClick={confirmAction}
          disabled={!isConfirmEnabled()}
        >
          Confirm Action
        </button>
      ) : (
        <button className={styles.button} onClick={onComplete}>
          Done
        </button>
      )}
    </div>
  );
}
