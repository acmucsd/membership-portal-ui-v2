import styles from '@/components/leaderboard/TopThreeCard/style.module.scss';

interface UserCardProps {
  position: 1 | 2 | 3;
  state: String;
  rank: String;
  name: String;
  points: number;
  image: String;
}
const positionNames = ['first', 'second', 'third'];

const TopUserCard = ({ position, state, rank, name, points, image }: UserCardProps) => {
  const trimName = name.length >= 25 ? `${name.substring(0, 24)}...` : name;
  return (
    <div className={`${styles.leaderboardCard} ${styles[positionNames[position - 1]]}`}>
      <div className={styles.cardLeft}>{position}</div>
      <div className={styles.cardRight}>
        <img className={styles.profileImage} src={image} alt="profile-pic" />
        <span className={styles.cardText}>{trimName}</span>
        <span className={styles.cardText}>{rank}</span>
        <span className={styles.cardText}>{points} points</span>
      </div>
    </div>
  );
};

export default TopUserCard;
