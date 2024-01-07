import HeroRainbow from '@/components/store/HeroRainbow';
import HeroDeco1 from '@/public/assets/graphics/store/hero-deco1.svg';
import HeroDeco2 from '@/public/assets/graphics/store/hero-deco2.svg';
import HeroPhoto from '@/public/assets/graphics/store/hero-photo.jpg';
import Image from 'next/image';
import { useState } from 'react';
import styles from './style.module.scss';

interface HeroProps {
  onHelp: () => void;
}

const Hero = ({ onHelp }: HeroProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.left}>
          <div className={`${styles.imageWrapper} ${loaded ? '' : styles.loading}`}>
            <Image
              src={HeroPhoto}
              alt="A crowd of ACM members holding up ACM diamond shapes with their fingers."
              fill
              onLoad={() => setLoaded(true)}
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
      <HeroRainbow />
    </div>
  );
};

export default Hero;
