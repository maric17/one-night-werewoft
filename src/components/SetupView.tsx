'use client';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import Card from './Card';
import { Role } from '../types/game';
import styles from './SetupView.module.css';

// Base deck of available roles to pick from
const BASE_DECK: Omit<Role, 'id'>[] = [
  { name: 'Werewolf', team: 'Werewolf' },
  { name: 'Werewolf', team: 'Werewolf' },
  { name: 'Seer', team: 'Village' },
  { name: 'Robber', team: 'Village' },
  { name: 'Troublemaker', team: 'Village' },
  { name: 'Insomniac', team: 'Village' },
  { name: 'Villager', team: 'Village' },
  { name: 'Villager', team: 'Village' }
];

export default function SetupView() {
  const { state, setState } = useGame();
  const [name, setName] = useState('');

  const addPlayer = () => {
    if (!name.trim()) return;
    setState(prev => ({
      ...prev,
      players: [...prev.players, { id: Date.now().toString(), name, originalRole: null, currentRole: null }]
    }));
    setName('');
  };

  const removePlayer = (id: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const toggleRole = (roleTemplate: Omit<Role, 'id'>, index: number) => {
    setState(prev => {
      // We use the index in the BASE_DECK to uniquely identify selections for duplicate roles
      const uniqueId = `${roleTemplate.name}-${index}`;
      const isSelected = prev.availableRoles.some(r => r.id === uniqueId);
      
      if (isSelected) {
        return {
          ...prev,
          availableRoles: prev.availableRoles.filter(r => r.id !== uniqueId)
        };
      } else {
        // Enforce max 1 werewolf for 3 player games to keep it balanced
        if (state.players.length === 3 && roleTemplate.name === 'Werewolf') {
          const werewolfCount = prev.availableRoles.filter(r => r.name === 'Werewolf').length;
          if (werewolfCount >= 1) return prev;
        }

        return {
          ...prev,
          availableRoles: [...prev.availableRoles, { ...roleTemplate, id: uniqueId }]
        };
      }
    });
  };

  const requiredRoles = state.players.length > 0 ? state.players.length + 3 : 0;
  const currentRolesCount = state.availableRoles.length;
  const canStart = state.players.length >= 3 && currentRolesCount === requiredRoles;

  const startGame = () => {
    setState(prev => {
      // 1. Shuffle available roles
      const deck = [...prev.availableRoles].sort(() => Math.random() - 0.5);
      
      // 2. Deal to players
      const newPlayers = prev.players.map((p, idx) => ({
        ...p,
        originalRole: deck[idx],
        currentRole: deck[idx] // They start the game with this role
      }));

      // 3. 3 cards go to the center
      const newCenterCards = deck.slice(newPlayers.length);

      return {
        ...prev,
        players: newPlayers,
        centerCards: newCenterCards,
        phase: 'PASS_AND_VIEW'
      };
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>One Night Ultimate Werewolf</h1>
      
      <div className={styles.card}>
        <h2>1. Add Players ({state.players.length})</h2>
        <div className={styles.inputGroup}>
          <input 
            className={styles.input}
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter player name"
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button className={styles.button} onClick={addPlayer}>Add</button>
        </div>
        
        <ul className={styles.playerList}>
          {state.players.map(p => (
            <li key={p.id} className={styles.playerItem} onClick={() => removePlayer(p.id)} style={{ cursor: 'pointer' }}>
              {p.name} <span style={{ float: 'right', color: '#f87171' }}>×</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.card} style={{ maxWidth: '600px' }}>
        <h2>2. Select Roles ({currentRolesCount} / {requiredRoles || '?'})</h2>
        <p className={styles.helperText} style={{ marginTop: 0, marginBottom: '16px' }}>
          Select exactly {requiredRoles} roles (Players + 3).
        </p>
        
        <div className={styles.roleGrid}>
          {BASE_DECK.map((role, idx) => {
            const uniqueId = `${role.name}-${idx}`;
            const isSelected = state.availableRoles.some(r => r.id === uniqueId);
            return (
              <div 
                key={uniqueId}
                style={{
                  opacity: isSelected ? 1 : 0.4,
                  filter: isSelected ? 'none' : 'grayscale(100%)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Card 
                  role={{ ...role, id: uniqueId }}
                  isSelected={isSelected}
                  isFlipped={false} // Always show face up during setup
                  onClick={() => toggleRole(role, idx)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button 
        className={`${styles.button} ${styles.primaryButton}`} 
        onClick={startGame}
        disabled={!canStart}
      >
        Start Game
      </button>
      
      {!canStart && state.players.length >= 3 && (
        <p className={styles.helperText}>Select {requiredRoles - currentRolesCount} more role(s) to start.</p>
      )}
      {state.players.length < 3 && (
        <p className={styles.helperText}>Need at least 3 players to start.</p>
      )}
    </div>
  );
}
