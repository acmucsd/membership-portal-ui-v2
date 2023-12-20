import styles from './style.module.scss';

interface PointsDisplayProps {
  points: number;
  attended: boolean;
}

const PointsDisplay = ({ points, attended }: PointsDisplayProps) => {
  return (
    <div className={`${styles.circle} ${attended ? styles.green : styles.blue}`}>
      <div className={styles.inner} />
      <h2 className={styles.points}>{points}</h2>
    </div>
  );
};

export default PointsDisplay;
