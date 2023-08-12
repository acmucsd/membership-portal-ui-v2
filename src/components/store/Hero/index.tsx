import HeroDeco1 from '@/public/assets/graphics/store/hero-deco1.svg';
import HeroDeco2 from '@/public/assets/graphics/store/hero-deco2.svg';
import HeroPhoto from '@/public/assets/graphics/store/hero-photo.jpg';
import Image from 'next/image';
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

interface HeroProps {
  onHelp: () => void;
}

const Hero = ({ onHelp }: HeroProps) => {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.hero}>
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            <Image
              src={HeroPhoto}
              alt="A crowd of ACM members holding up ACM diamond shapes with their fingers."
              fill
            />
          </div>
        </div>
        <div className={styles.right}>
          <HeroDeco1 className={styles.deco1} alt="Various decorative snowflakes" aria-hidden />
          <div className={styles.heroContent}>
            <h1 className={styles.heading}>The ACM Store</h1>
            <p className={styles.description}>
              Shop the ACM Store for exclusive ACM merchandise including shirts, hoodies, pop
              sockets & more!
            </p>
            <button type="button" className={styles.textButton} onClick={onHelp}>
              How does the ACM Store work?
            </button>
          </div>
          <HeroDeco2 className={styles.deco2} alt="Various decorative sparkles" aria-hidden />
        </div>
      </div>
      <div className={styles.rainbowWrapper}>
        <RainbowBars className={styles.barsLeft} />
        <div className={styles.rainbowContent}>
          <svg
            width="789"
            height="546"
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
    </div>
  );
};

export default Hero;
