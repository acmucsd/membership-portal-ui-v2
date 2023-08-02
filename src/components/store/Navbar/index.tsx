import Link from 'next/link';
import styles from './style.module.scss';

interface NavbarProps {
  backUrl?: string;
}

const Navbar = ({ backUrl }: NavbarProps) => {
  const balance = 2000;
  return (
    <div className={styles.navbar}>
      {backUrl && (
        <Link href={backUrl} className={styles.back}>
          Back
        </Link>
      )}
      <div className={styles.rightSide}>
        <span>
          <strong>Balance:</strong> {balance}
        </span>
        <Link href="/store/cart" className={styles.navlink}>
          Cart
        </Link>
        <Link href="/store/orders" className={styles.navlink}>
          My Orders
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
