import Link from 'next/link';
import { BsPlus } from 'react-icons/bs';
import styles from './style.module.scss';

interface CreateItemCardProps {
  className?: string;
  href: string;
  label: string;
}

/**
 * A card that represents either
 * - a store item that costs `cost` diamonds (optional `outOfStock`), or
 * - a collection with a `description`.
 */
const CreateItemCard = ({ className, href, label }: CreateItemCardProps) => {
  return (
    <Link href={href} className={`${className} ${styles.itemCard}`}>
      <BsPlus className={styles.icon} aria-hidden />
      {label}
    </Link>
  );
};

export default CreateItemCard;
