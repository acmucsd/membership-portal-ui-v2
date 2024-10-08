import ThemeToggle from '@/components/common/ThemeToggle';
import { config } from '@/lib';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { PermissionService } from '@/lib/services';
import { UserAccessType } from '@/lib/types/enums';
import LightModeLogo from '@/public/assets/acm-logos/general/light-mode.png';
import CalendarIcon from '@/public/assets/icons/calendar-icon.svg';
import HomeIcon from '@/public/assets/icons/home-icon.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import SettingsIcon from '@/public/assets/icons/setting-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

interface NavbarProps {
  accessType?: UserAccessType;
  /** Used on the onboarding screen to avoid a distracting double rainbow */
  quiet?: boolean;
}
const Navbar = ({ accessType, quiet }: NavbarProps) => {
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

  if (!accessType || quiet) {
    return (
      <header className={styles.header}>
        <div className={`${styles.content} ${quiet ? styles.quiet : ''}`}>
          {quiet ? (
            <span className={styles.navLeft}>
              <Image src={LightModeLogo} alt="ACM General Logo" width={48} height={48} />
            </span>
          ) : (
            <Link href={config.homeRoute} className={styles.navLeft}>
              <Image src={LightModeLogo} alt="ACM General Logo" width={48} height={48} />
              <span className={styles.headerTitle}>Membership Portal</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
        {!quiet ? <hr className={`${styles.wainbow} ${styles.loggedOut}`} /> : null}
      </header>
    );
  }

  const isAdmin = PermissionService.canViewAdminPage.includes(accessType);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.content}>
        {/* Mobile Navbar Toggle */}
        <button type="button" className={styles.toggleIcon} onClick={toggleMenu}>
          <div className={styles.bar1} data-open={menuOpen} />
          <div className={styles.bar2} data-open={menuOpen} />
        </button>
        <Link href={config.homeRoute} className={styles.icon} onClick={() => setMenuOpen(false)}>
          <Image src={LightModeLogo} alt="ACM Membership Home" width={48} height={48} />
        </Link>
        {/* Desktop Nav Links */}
        <nav className={styles.portalLinks}>
          <Link href={config.homeRoute}>Home</Link>
          <p aria-hidden>·</p>
          <Link href={config.eventsRoute}>Events</Link>
          <p aria-hidden>·</p>
          <Link href={config.leaderboardRoute}>Leaderboard</Link>
          <p aria-hidden>·</p>
          <Link href={config.store.homeRoute}>Store</Link>
        </nav>
        <nav className={styles.iconLinks}>
          <ThemeToggle />
          {isAdmin ? (
            <Link href="/admin" className={styles.iconLink}>
              <SettingsIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
            </Link>
          ) : null}
          <Link href={config.profile.route} className={styles.iconLink}>
            <ProfileIcon color="var(--theme-text-on-background-1)" />
          </Link>
        </nav>
      </div>
      {/* Mobile Menu Dropdown */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={styles.mobileNav}
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        onClick={e => (e.target as Element).closest('a') && setMenuOpen(false)}
      >
        <Link className={styles.mobileNavItem} href={config.homeRoute}>
          <HomeIcon className={styles.iconLink} />
          Home
        </Link>
        <Link className={styles.mobileNavItem} href={config.eventsRoute}>
          <CalendarIcon className={styles.iconLink} />
          Events
        </Link>
        <Link className={styles.mobileNavItem} href={config.leaderboardRoute}>
          <LeaderboardIcon className={styles.iconLink} />
          Leaderboard
        </Link>
        <Link className={styles.mobileNavItem} href={config.profileRoute}>
          <ProfileIcon className={styles.iconLink} />
          Profile
        </Link>
        <Link className={styles.mobileNavItem} href={config.store.homeRoute}>
          <ShopIcon className={styles.iconLink} />
          Store
        </Link>
        {isAdmin ? (
          <Link className={styles.mobileNavItem} href={config.admin.homeRoute}>
            <SettingsIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
            Admin Settings
          </Link>
        ) : null}
        <div className={styles.mobileSwitch}>
          <ThemeToggle />
        </div>
        <hr className={styles.wainbow} />
      </div>
    </header>
  );
};

export default memo(Navbar);
