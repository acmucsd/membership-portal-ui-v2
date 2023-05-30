import Image from 'next/image';
import styles from './style.module.scss';

interface LeaderboardRowProps {
  position: number;
  rank: string;
  name: string;
  points: number;
  image: string;
}

const LeaderboardRow = ({ position, rank, name, points, image }: LeaderboardRowProps) => {
  return (
    <div className={styles.row} data-style={position % 2 === 0 ? 'even' : 'odd'}>
      <span>{position}</span>
      <Image src={image} width={36} height={36} alt="User" />
      <span>{name}</span>
      <span>{rank}</span>
      <span>{points} points</span>
    </div>
  );
};

export default LeaderboardRow;
