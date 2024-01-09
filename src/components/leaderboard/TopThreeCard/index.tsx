import GifSafeImage from '@/components/common/GifSafeImage';
import { trim } from '@/lib/utils';
import Link from 'next/link';
import styles from './style.module.scss';

interface UserCardProps {
  position: number;
  rank: string;
  name: string;
  url: string;
  points: number;
  image: string;
}
const positionNames = ['first', 'second', 'third'];

const TopThreeCard = ({ position, rank, name, url, points, image }: UserCardProps) => {
  return (
    <Link href={url} className={styles.leaderboardCard} data-position={positionNames[position - 1]}>
      <div className={styles.cardLeft}>{position}</div>
      <div className={styles.cardRight}>
        <GifSafeImage
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
    </Link>
  );
};

export default TopThreeCard;
