import { config } from '@/lib';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import LightModeLogo from '@/public/assets/acm-logos/general/light-mode.png';
import ACMIcon from '@/public/assets/icons/acm-icon.svg';
import CalendarIcon from '@/public/assets/icons/calendar-icon.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import DarkModeToggle from '../DarkModeToggle';
import styles from './style.module.scss';

interface NavbarProps {
  user: PrivateProfile;
}
const Navbar = ({ user }: NavbarProps) => {
  const size = useWindowSize();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Switch to mobile less than breakpointMd
  useEffect(() => {
    setMobile((size.width || 0) <= config.cssVars.breakpointMd);
  }, [size]);

  // If they go back to desktop size, don't keep the menu open
  useEffect(() => {
    if (!mobile) setMenuOpen(false);
  }, [mobile]);

  if (!user)
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <Link href={config.homeRoute} className={styles.navLeft}>
            <Image src={LightModeLogo} alt="ACM General Logo" width={48} height={48} />
            <span className={styles.headerTitle}>Membership Portal</span>
          </Link>
          <DarkModeToggle />
        </div>
        <hr className={styles.wainbow} />
      </header>
    );

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        {/* Mobile Navbar Toggle */}
        <button
          type="button"
          className={`${styles.toggleIcon} ${!mobile && styles.hidden}`}
          onClick={toggleMenu}
        >
          <div className={`${styles.bar1} ${menuOpen && styles.open}`} />
          <div className={`${styles.bar2} ${menuOpen && styles.open}`} />
        </button>
        <Link href={config.homeRoute} className={`${styles.icon} ${mobile && styles.mobile}`}>
          <Image src={LightModeLogo} alt="ACM General Logo" width={48} height={48} />
        </Link>
        {/* Desktop Nav Links */}
        <nav className={`${styles.portalLinks} ${mobile && styles.hidden}`}>
          <Link href="/">Events</Link>
          <p>·</p>
          <Link href="/leaderboard">Leaderboard</Link>
          <span>·</span>
          <Link href="/about">About ACM</Link>
        </nav>
        <nav className={`${styles.iconLinks} ${mobile && styles.hidden}`}>
          <DarkModeToggle />
          <Link href="/store" className={styles.iconLink}>
            <ShopIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          </Link>
          <Link href="/profile" className={styles.iconLink}>
            <ProfileIcon color="var(--theme-text-on-background-1)" />
          </Link>
        </nav>
      </div>
      {/* Mobile Menu Dropdown */}
      <div className={`${styles.mobileNav} ${menuOpen && styles.open}`}>
        <Link className={styles.mobileNavItem} onClick={() => setMenuOpen(false)} href="/">
          <CalendarIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          Events
        </Link>
        <Link
          className={styles.mobileNavItem}
          onClick={() => setMenuOpen(false)}
          href="/leaderboard"
        >
          <LeaderboardIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          Leaderboard
        </Link>
        <Link className={styles.mobileNavItem} onClick={() => setMenuOpen(false)} href="/profile">
          <ProfileIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          Profile
        </Link>
        <Link onClick={() => setMenuOpen(false)} className={styles.mobileNavItem} href="/store">
          <ShopIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          Store
        </Link>
        <Link onClick={() => setMenuOpen(false)} className={styles.mobileNavItem} href="/about">
          <ACMIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          About ACM
        </Link>
        <DarkModeToggle />{' '}
      </div>
      <hr className={styles.wainbow} />
    </header>
  );
};

export default memo(Navbar);
