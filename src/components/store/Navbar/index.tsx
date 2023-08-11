import Diamonds from '@/components/store/Diamonds';
import { config } from '@/lib';
import BackChevron from '@/public/assets/icons/back-chevron.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './style.module.scss';

interface NavbarProps {
  balance: number;
  showBack?: boolean;
}

const Navbar = ({ balance, showBack }: NavbarProps) => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      {showBack && (
        <button type="button" className={styles.back} onClick={() => router.back()}>
          <BackChevron aria-hidden="true" />
          Back
        </button>
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
