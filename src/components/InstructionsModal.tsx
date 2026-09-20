import Image from 'next/image';
import styles from './InstructionsModal.module.css';
import { RoleName } from '../types/game';

type InstructionsModalProps = {
  onClose: () => void;
};

const ROLES: { name: RoleName; desc: string }[] = [
  { name: 'Werewolf', desc: 'Wake up and look for other werewolves. If you are the only werewolf, you may look at one center card.' },
  { name: 'Seer', desc: 'Wake up and look at one player\'s card OR up to two center cards.' },
  { name: 'Robber', desc: 'Wake up and swap your card with another player\'s card, then look at your new card.' },
  { name: 'Troublemaker', desc: 'Wake up and swap two other players\' cards without looking at them.' },
  { name: 'Insomniac', desc: 'Wake up and look at your own card to see if your role has changed.' },
  { name: 'Villager', desc: 'No special abilities. Try to figure out who the werewolves are!' },
];

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        
        <h2 className={styles.title}>How to Play</h2>
        
        <div className={styles.section}>
          <h3>Game Rules</h3>
          <p className={styles.text}>
            <strong>1. Setup:</strong> Pick roles for all players. There are always 3 extra cards placed in the center. Everyone looks at their secret card.
          </p>
          <p className={styles.text}>
            <strong>2. Night Phase:</strong> Everyone closes their eyes. The app will narrate and wake up specific roles one by one to perform their secret actions.
          </p>
          <p className={styles.text}>
            <strong>3. Day Phase:</strong> Everyone wakes up and discusses for 5 minutes. Try to figure out who the Werewolves are (or if they are in the center)! Remember, your card might have been swapped during the night!
          </p>
          <p className={styles.text}>
            <strong>4. Voting:</strong> On the count of 3, everyone points at someone to eliminate. If at least one Werewolf is eliminated, the Village wins! If no Werewolves are eliminated, the Werewolves win!
          </p>
        </div>

        <div className={styles.section}>
          <h3>Roles</h3>
          <div className={styles.roleList}>
            {ROLES.map(role => {
              const imageName = role.name.toLowerCase();
              return (
                <div key={role.name} className={styles.roleItem}>
                  <div className={styles.roleImageWrapper}>
                    <Image 
                      src={`/roles/${imageName}.jpg`} 
                      alt={role.name} 
                      fill 
                      className={styles.roleImage} 
                    />
                  </div>
                  <div className={styles.roleContent}>
                    <div className={styles.roleName}>{role.name}</div>
                    <div className={styles.roleDesc}>{role.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
