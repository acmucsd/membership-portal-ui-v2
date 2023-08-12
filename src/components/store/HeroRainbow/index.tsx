import styles from './style.module.scss';

interface RainbowBarsProps {
  className: string;
}

const RainbowBars = ({ className }: RainbowBarsProps) => {
  return (
    <div className={className}>
      <div className={styles.teal} />
      <div className={styles.orange} />
      <div className={styles.red} />
      <div className={styles.pink} />
    </div>
  );
};

const HeroRainbow = () => {
  return (
    <div className={styles.rainbowWrapper}>
      <RainbowBars className={styles.barsLeft} />
      <div className={styles.rainbowContent}>
        <svg
          width="789"
          height="546"
          viewBox="0 0 789 546"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.rainbow}
        >
          <path
            d="M 0 13 H 616 a 160 160 0 0 1 0 320 H 173 a 40 40 0 0 0 0 80 H 789"
            className={styles.teal}
          />
          <path
            d="M 0 53 H 616 a 120 120 0 0 1 0 240 H 173 a 80 80 0 0 0 0 160 H 789"
            className={styles.orange}
          />
          <path
            d="M 0 93 H 616 a 80 80 0 0 1 0 160 H 173 a 120 120 0 0 0 0 240 H 789"
            className={styles.red}
          />
          <path
            d="M 0 133 H 616 a 40 40 0 0 1 0 80 H 173 a 160 160 0 0 0 0 320 H 789"
            className={styles.pink}
          />
        </svg>
        <RainbowBars className={styles.barsRest} />
      </div>
      <RainbowBars className={styles.barsRight} />
    </div>
  );
};

export default HeroRainbow;
