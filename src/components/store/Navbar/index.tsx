import Diamonds from '@/components/store/Diamonds';
import { config } from '@/lib';
import BackChevron from '@/public/assets/icons/back-chevron.svg';
import Link from 'next/link';
import styles from './style.module.scss';

interface NavbarProps {
  balance: number;
  backUrl?: string;
}

const Navbar = ({ balance, backUrl }: NavbarProps) => {
  return (
    <nav className={styles.navbar}>
      {backUrl && (
        <Link href={backUrl} className={styles.back}>
          <BackChevron aria-hidden="true" />
          Back
        </Link>
      )}
      <div className={styles.rightSide}>
        <span>
          <strong>Balance:</strong> <Diamonds count={balance} />
        </span>
        <Link href={config.cartRoute} className={styles.navlink}>
          Cart
        </Link>
        <Link href={config.myOrdersRoute} className={styles.navlink}>
          My Orders
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
