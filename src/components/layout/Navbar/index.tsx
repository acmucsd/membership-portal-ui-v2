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
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import DarkModeToggle from '../DarkModeToggle';
import styles from './style.module.scss';

interface NavbarProps {
  user: PrivateProfile;
}
const Navbar = ({ user }: NavbarProps) => {
  const size = useWindowSize();
  const headerRef = useRef<HTMLHeadElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen(prevState => !prevState), []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Switch to mobile less than breakpointMd
  const isMobile = (size.width ?? 0) <= config.cssVars.breakpointMd;

  // If they go back to desktop size, don't keep the menu open
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

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
    <header className={styles.header} ref={headerRef}>
      <div className={styles.content}>
        {/* Mobile Navbar Toggle */}
        <button type="button" className={styles.toggleIcon} onClick={toggleMenu}>
          <div className={styles.bar1} data-open={menuOpen} />
          <div className={styles.bar2} data-open={menuOpen} />
        </button>
        <Link href={config.homeRoute} className={styles.icon}>
          <Image src={LightModeLogo} alt="ACM Membership Home" width={48} height={48} />
        </Link>
        {/* Desktop Nav Links */}
        <nav className={styles.portalLinks}>
          <Link href={config.homeRoute}>Events</Link>
          <p aria-hidden>·</p>
          <Link href="/leaderboard">Leaderboard</Link>
          <span aria-hidden>·</span>
          <Link href="/about">About ACM</Link>
        </nav>
        <nav className={styles.iconLinks}>
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
      <div className={styles.mobileNav} data-open={menuOpen} aria-hidden={!menuOpen}>
        <Link
          className={styles.mobileNavItem}
          onClick={() => setMenuOpen(false)}
          href={config.homeRoute}
        >
          <CalendarIcon className={styles.iconLink} />
          Events
        </Link>
        <Link
          className={styles.mobileNavItem}
          onClick={() => setMenuOpen(false)}
          href="/leaderboard"
        >
          <LeaderboardIcon className={styles.iconLink} />
          Leaderboard
        </Link>
        <Link className={styles.mobileNavItem} onClick={() => setMenuOpen(false)} href="/profile">
          <ProfileIcon className={styles.iconLink} />
          Profile
        </Link>
        <Link
          onClick={() => setMenuOpen(false)}
          className={styles.mobileNavItem}
          href={config.storeRoute}
        >
          <ShopIcon className={styles.iconLink} />
          Store
        </Link>
        <Link onClick={() => setMenuOpen(false)} className={styles.mobileNavItem} href="/about">
          <ACMIcon className={styles.iconLink} />
          About ACM
        </Link>
        <div>
          <DarkModeToggle />
        </div>
      </div>
      <hr className={styles.wainbow} />
    </header>
  );
};

export default memo(Navbar);
