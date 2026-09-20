'use client';
import Image from 'next/image';
import { Role } from '../types/game';
import styles from './Card.module.css';

type CardProps = {
  role?: Role;
  isFlipped?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Card({ role, isFlipped = false, isSelected = false, onClick }: CardProps) {
  // Use lowercase role name for the image file
  const imageName = role?.name?.toLowerCase() || 'villager';

  return (
    <div 
      className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''} ${isSelected ? styles.selected : ''}`} 
      onClick={onClick}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront} data-team={role?.team}>
          {role?.name && (
            <Image 
              src={`/roles/${imageName}.jpg`} 
              alt={role.name} 
              fill 
              className={styles.cardImage} 
            />
          )}
          <span className={styles.cardName}>{role?.name || 'Unknown'}</span>
        </div>
        <div className={styles.cardBack}>
          {/* Plain back, no text */}
        </div>
      </div>
    </div>
  );
}
