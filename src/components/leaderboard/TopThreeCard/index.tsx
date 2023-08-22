import { trim } from '@/lib/utils';
import Image from 'next/image';
import styles from './style.module.scss';

interface UserCardProps {
  position: number;
  rank: string;
  name: string;
  points: number;
  image: string;
  match?: {
    index: number;
    length: number;
  };
}
const positionNames = ['first', 'second', 'third'];

const TopThreeCard = ({ position, rank, name, points, image, match }: UserCardProps) => {
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
        <span className={styles.cardText}>
          {match ? (
            <>
              {name.slice(0, match.index)}
              <span className={styles.match}>
                {name.slice(match.index, match.index + match.length)}
              </span>
              {name.slice(match.index + match.length)}
            </>
          ) : (
            trim(name, 25)
          )}
        </span>
        <span className={styles.cardText}>{rank}</span>
        <span className={styles.cardText}>{points} points</span>
      </div>
    </div>
  );
};

export default TopThreeCard;
