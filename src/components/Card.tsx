'use client';
import { Role } from '../types/game';
import styles from './Card.module.css';

type CardProps = {
  role?: Role;
  isFlipped?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Card({ role, isFlipped = false, isSelected = false, onClick }: CardProps) {
  return (
    <div 
      className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''} ${isSelected ? styles.selected : ''}`} 
      onClick={onClick}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront} data-team={role?.team}>
          <span className={styles.cardName}>{role?.name || 'Unknown'}</span>
        </div>
        <div className={styles.cardBack}>
          <span className={styles.cardName}>WEREWOLF</span>
        </div>
      </div>
    </div>
  );
}
