import { Typography } from '@/components/common';
import HomeActions from '@/components/home/HomeActions';
import { config } from '@/lib';
import { PrivateProfile } from '@/lib/types/apiResponses';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface HeroProps {
  user: PrivateProfile;
  points: number;
  checkin: (code: string) => void;
}

const Hero = ({ user, points, checkin }: HeroProps) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.hero}>
      <Image
        className={`${styles.image} ${styles.desktopOnly}`}
        src="/assets/graphics/portal/raccoon-hero.svg"
        alt="Landing page graphic"
        priority
        fill
      />
      <Image
        className={styles.image}
        src="/assets/graphics/portal/waves.svg"
        alt="Landing page graphic"
        priority
        fill
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <Typography variant="h5/regular">{today}</Typography>
          <Typography variant="display/light/small" className={styles.heading} component="span">
            {'Welcome to ACM, '}
            <strong>
              <Link href={config.profileRoute}>{user.firstName}</Link>
            </strong>
            !
          </Typography>
        </div>
        <div className={styles.mobile}>
          <HomeActions user={user} points={points} checkin={checkin} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
