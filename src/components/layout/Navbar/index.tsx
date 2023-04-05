import DarkModeToggle from '@/components/layout/DarkModeToggle';
import { config } from '@/lib';
import { PrivateProfile } from '@/lib/types/apiResponses';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import styles from './style.module.scss';

interface NavbarProps {
  user: PrivateProfile;
}
const Navbar = ({ user }: NavbarProps) => {
  if (!user)
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <Link href={config.homeRoute} passHref>
            <a href="replace" className={styles.navLeft}>
              <Image
                src="/assets/acm-logos/general/light-mode.png"
                alt="ACM General Logo"
                width={48}
                height={48}
              />
              <span className={styles.headerTitle}>Membership Portal</span>
            </a>
          </Link>
          <DarkModeToggle />
        </div>
        <hr className={styles.wainbow} />
      </header>
    );

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href={config.homeRoute} passHref>
          <a href="replace" className={styles.icon}>
            <Image
              src="/assets/acm-logos/general/light-mode.png"
              alt="ACM General Logo"
              width={48}
              height={48}
            />
          </a>
        </Link>
        <nav className={styles.portalLinks}>
          <Link href="/">Events</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/about">About ACM</Link>
        </nav>
        <nav className={styles.iconLinks}>
          <DarkModeToggle />
          <Link href="/store">
            <img src="profile-icon.svg" alt="" />
          </Link>
          <Link href="/profile">profile</Link>
        </nav>
      </div>
      <hr className={styles.wainbow} />
    </header>
  );
};

export default memo(Navbar);
