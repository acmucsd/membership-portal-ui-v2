/* eslint-disable @next/next/no-img-element */
import styles from '@/components/leaderboard/TopThreeCard/style.module.scss';

interface UserCardProps {
  position: 1 | 2 | 3;
  rank: string;
  name: string;
  points: number;
  image: string;
}
const positionNames = ['first', 'second', 'third'];

const TopUserCard = ({ position, rank, name, points, image }: UserCardProps) => {
  const trimName = name.length >= 25 ? `${name.substring(0, 24)}...` : name;
  return (
    <div className={styles.leaderboardCard} data-position={positionNames[position - 1]}>
      <div className={styles.cardLeft}>{position}</div>
      <div className={styles.cardRight}>
        {
          // eslint-disable-next- @next/next/no-img-element
        }
        <img className={styles.profileImage} src={image} alt="User Profile Pic" />
        <span className={styles.cardText}>{trimName}</span>
        <span className={styles.cardText}>{rank}</span>
        <span className={styles.cardText}>{points} points</span>
      </div>
    </div>
  );
};

export default TopUserCard;
