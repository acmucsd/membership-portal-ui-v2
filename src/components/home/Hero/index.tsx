import { Typography } from '@/components/common';
import { config } from '@/lib';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import CheckMark from '@/public/assets/icons/check-mark.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from './style.module.scss';

interface HeroProps {
  user: PrivateProfile;
  checkin: (code: string) => void;
}

const Hero = ({ user, checkin }: HeroProps) => {
  const [checkinCode, setCheckinCode] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkinCode !== ' ') {
      checkin(checkinCode);
    }
  };

  return (
    <div className={styles.hero}>
      <Image
        className={`${styles.image} ${styles.desktop}`}
        src="/assets/graphics/portal/raccoon-waves.svg"
        alt="Landing page graphic"
        priority
        fill
      />
      <Image
        className={`${styles.image} ${styles.mobile}`}
        src="/assets/graphics/portal/waves.svg"
        alt="Landing page graphic"
        priority
        fill
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <Typography variant="display/light/large" className={styles.headline}>
              {'Welcome to ACM, '}
            </Typography>
            <Link href={config.profileRoute}>
              <Typography variant="display/heavy/large" className={styles.headline}>
                {user.firstName}
              </Typography>
            </Link>
            <Typography variant="display/light/large" className={styles.headline}>
              !
            </Typography>
          </div>
          <div>
            <Typography variant="h3/regular" className={styles.inline}>
              {'You have '}
            </Typography>
            <Typography variant="h3/bold" className={styles.inline}>
              {user.points}
            </Typography>
            <Typography variant="h3/regular" className={styles.inline}>
              {' membership points.'}
            </Typography>
          </div>
        </div>
        <div className={styles.actions}>
          <form className={styles.checkin} onSubmit={handleSubmit} action="">
            <Typography variant="h1/regular">Check in to an event</Typography>
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
          <Link href={config.storeRoute} className={styles.link}>
            <LeaderboardIcon />
            <Typography variant="h4/regular">Spend points on merch</Typography>
          </Link>
          <Link href={config.leaderboardRoute} className={styles.link}>
            <ShopIcon />
            <Typography variant="h4/regular">Compete with friends</Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
