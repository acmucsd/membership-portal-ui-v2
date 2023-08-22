import Image from 'next/image';
import { RefObject } from 'react';
import styles from './style.module.scss';

interface LeaderboardRowProps {
  position: number;
  rank: string;
  name: string;
  points: number;
  image: string;
  rowRef: RefObject<HTMLDivElement> | null;
}

const LeaderboardRow = ({ position, rank, name, points, image, rowRef }: LeaderboardRowProps) => {
  return (
    <div className={styles.row} ref={rowRef}>
      <span className={styles.position}>{position}</span>
      <Image
        src={image}
        width={36}
        height={36}
        quality={10}
        alt={`Profile picture for ${name}`}
        className={styles.profilePicture}
      />
      <div className={styles.nameRank}>
        <span className={styles.name}>{name}</span>
        <span className={styles.rank}>{rank}</span>
      </div>
      <span className={styles.points}>{points} points</span>
    </div>
  );
};

export default LeaderboardRow;
