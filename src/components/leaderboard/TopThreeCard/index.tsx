import { trim } from '@/lib/utils';
import Image from 'next/image';
import styles from './style.module.scss';

interface UserCardProps {
  position: 1 | 2 | 3;
  rank: string;
  name: string;
  points: number;
  image: string;
}
const positionNames = ['first', 'second', 'third'];

const TopThreeCard = ({ position, rank, name, points, image }: UserCardProps) => {
  return (
    <div className={styles.leaderboardCard} data-position={positionNames[position - 1]}>
      <div className={styles.cardLeft}>{position}</div>
      <div className={styles.cardRight}>
        <Image
          className={styles.profileImage}
          src={image}
          alt="User Profile Pic"
          width={80}
          height={80}
        />
        <span className={styles.cardText}>{trim(name, 25)}</span>
        <span className={styles.cardText}>{rank}</span>
        <span className={styles.cardText}>{points} points</span>
      </div>
    </div>
  );
};

export default TopThreeCard;
