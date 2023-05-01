import { config } from '@/lib';
import { PermissionService } from '@/lib/services';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import LightModeLogo from '@/public/assets/acm-logos/general/light-mode.png';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import SettingsIcon from '@/public/assets/icons/setting-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import DarkModeToggle from '../DarkModeToggle';
import styles from './style.module.scss';

interface NavbarProps {
  user: PrivateProfile;
}
const Navbar = ({ user }: NavbarProps) => {
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

  const isAdmin = PermissionService.canViewAdminPage().includes(user.accessType);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href={config.homeRoute} className={styles.icon}>
          <Image src={LightModeLogo} alt="ACM General Logo" width={48} height={48} />
        </Link>
        <nav className={styles.portalLinks}>
          <Link href="/">Events</Link>
          <p>·</p>
          <Link href="/leaderboard">Leaderboard</Link>
          <span>·</span>
          <Link href="/about">About ACM</Link>
        </nav>
        <nav className={styles.iconLinks}>
          <DarkModeToggle />
          {isAdmin ? (
            <Link href="/admin" className={styles.iconLink}>
              <SettingsIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
            </Link>
          ) : null}
          <Link href="/store" className={styles.iconLink}>
            <ShopIcon color="var(--theme-text-on-background-1)" className={styles.iconLink} />
          </Link>
          <Link href="/profile" className={styles.iconLink}>
            <ProfileIcon color="var(--theme-text-on-background-1)" />
          </Link>
        </nav>
      </div>
      <hr className={styles.wainbow} />
    </header>
  );
};

export default memo(Navbar);
