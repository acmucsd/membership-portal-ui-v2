import Diamonds from '@/components/store/Diamonds';
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
          <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden="true">
            <path d="M10.1911 18L0 9L10.1911 0L12 1.5975L3.61783 9L12 16.4025L10.1911 18Z" />
          </svg>
          Back
        </Link>
      )}
      <div className={styles.rightSide}>
        <span>
          <strong>Balance:</strong> <Diamonds count={balance} />
        </span>
        <Link href="/store/cart" className={styles.navlink}>
          Cart
        </Link>
        <Link href="/store/orders" className={styles.navlink}>
          My Orders
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
