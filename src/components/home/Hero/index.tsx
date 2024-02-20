import { Typography } from '@/components/common';
import { config } from '@/lib';
import CheckMark from '@/public/assets/icons/check-mark.svg';
import InfoIcon from '@/public/assets/icons/info-icon.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from './style.module.scss';

interface HeroProps {
  firstName: string;
  points: number;
  checkin: (code: string) => void;
}

const Hero = ({ firstName, points, checkin }: HeroProps) => {
  const [checkinCode, setCheckinCode] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkinCode !== '') {
      checkin(checkinCode);
    }
  };

  return (
    <div className={styles.hero}>
      <Image
        className={`${styles.image} ${styles.mobile}`}
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
          <Typography variant="display/light/medium" className={styles.heading} component="span">
            {'Welcome to ACM, '}
            <strong>
              <Link href={config.profileRoute}>{firstName}</Link>
            </strong>
            !
          </Typography>
          <Typography variant="h4/regular" component="span" className={styles.subheading}>
            {'You have '}
            <strong>{points}</strong>
            {' membership points.'}
          </Typography>
        </div>
        <div className={styles.actions}>
          <form className={styles.checkin} onSubmit={handleSubmit} action="">
            <Typography variant="h4/regular" className={styles.subheading}>
              Check in to an event
            </Typography>
            <div className={styles.checkinButtons}>
              <input
                type="text"
                placeholder="Check-in code"
                className={styles.checkinInput}
                value={checkinCode}
                onChange={e => setCheckinCode(e.target.value)}
              />
              <button type="submit" className={styles.submit}>
                <CheckMark />
              </button>
            </div>
          </form>
          <Link href={config.store.homeRoute} className={styles.link}>
            <ShopIcon />
            <Typography variant="h4/regular" className={styles.subheading}>
              Spend points on merch
            </Typography>
          </Link>
          <Link href={config.leaderboardRoute} className={styles.link}>
            <LeaderboardIcon />
            <Typography variant="h4/regular" className={styles.subheading}>
              Compete with friends
            </Typography>
          </Link>
          <Link href={config.aboutRoute} className={styles.link}>
            <InfoIcon />
            <Typography variant="h4/regular" className={styles.subheading}>
              Learn more about ACM
            </Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
