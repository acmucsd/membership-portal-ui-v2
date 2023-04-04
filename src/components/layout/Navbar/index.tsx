import Link from 'next/link';
import { useRouter, withRouter } from 'next/router';

import ACMIcon from '@/public/assets/icons/acm-icon.svg';
import DashboardIcon from '@/public/assets/icons/dashboard-icon.svg';
import DiscordIcon from '@/public/assets/icons/discord-icon.svg';
import FeedbackIcon from '@/public/assets/icons/feedback-icon.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import OrdersIcon from '@/public/assets/icons/orders-icon.svg';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import SettingIcon from '@/public/assets/icons/setting-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import SignOutIcon from '@/public/assets/icons/sign-out-icon.svg';

import styles from './style.module.scss';

const navItems = {
  portal: [
    {
      route: '/portal',
      title: 'Dashboard',
      image: <DashboardIcon />,
    },
    {
      route: '/portal/leaderboard',
      title: 'Leaderboard',
      image: <LeaderboardIcon />,
    },
    {
      route: '/portal/profile',
      title: 'Profile',
      image: <ProfileIcon />,
    },
    {
      route: '/portal/about',
      title: 'Explore ACM',
      image: <ACMIcon />,
    },
    {
      route: '/portal/discord',
      title: 'Discord',
      image: <DiscordIcon />,
    },
    {
      route: '/portal/admin',
      title: 'Admin',
      image: <SettingIcon />,
    },
  ],
  store: [
    {
      route: '/store',
      title: 'Shop',
      image: <ShopIcon />,
    },
    {
      route: '/store/orders',
      title: 'Orders',
      image: <OrdersIcon />,
    },
    {
      route: '/store/admin',
      title: 'Admin',
      image: <SettingIcon />,
    },
  ],
  footer: [
    {
      route: 'https://www.acmurl.com/portal-feedback',
      title: 'Feedback',
      image: <FeedbackIcon />,
    },
    {
      route: '/logout',
      title: 'Sign Out',
      image: <SignOutIcon />,
    },
  ],
};

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className={styles.navMenu}>
      <section className={styles.navSection}>
        <h2 className={styles.sectionHeader}>Portal</h2>
        <div className={styles.navItems}>
          {navItems.portal.map(({ route, title, image }) => (
            <Link href={route} passHref key={`${title}}`}>
              <a
                href="replace"
                className={`${styles.navLink} ${router.route === route ? styles.active : ''}`}
              >
                {image}
                <span>{title}</span>
              </a>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.navSection}>
        <h2 className={styles.sectionHeader}>Store</h2>
        <div className={styles.navItems}>
          {navItems.store.map(({ route, title, image }) => (
            <Link href={route} passHref key={`${title}}`}>
              <a
                href="replace"
                className={`${styles.navLink} ${router.route === route ? styles.active : ''}`}
              >
                {image}
                <span>{title}</span>
              </a>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.navSection}>
        <div className={styles.navItems}>
          {navItems.footer.map(({ route, title, image }) => (
            <Link href={route} passHref key={`${title}}`}>
              <a
                href="replace"
                className={`${styles.navLink} ${router.route === route ? styles.active : ''}`}
              >
                {image}
                <span>{title}</span>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </nav>
  );
};

export default withRouter(Navbar);
