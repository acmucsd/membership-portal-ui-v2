import DarkModeToggle from '@/components/layout/DarkModeToggle';
import { config } from '@/lib';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

const PageHeader = () => (
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

export default PageHeader;
