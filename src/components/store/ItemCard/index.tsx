import Diamonds from '@/components/store/Diamonds';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface ItemCardProps {
  image: string;
  title: string;
  cost?: number;
  href?: string;
  description?: string;
  inStock?: boolean;
  className?: string;
}

const ItemCard = ({
  image,
  title,
  cost,
  href,
  description,
  inStock = true,
  className = '',
}: ItemCardProps) => {
  const Card = href ? Link : 'article';
  return (
    <Card href={href ?? ''} className={`${styles.itemCard} ${className}`}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill />
      </div>
      <div className={styles.details}>
        <p className={styles.title}>{title}</p>
        {description && <p>{description}</p>}
        {(cost || !inStock) && (
          <p className={styles.cost}>
            {cost && <Diamonds count={cost} />}{' '}
            {!inStock && <span className={styles.outOfStock}>Out of stock</span>}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ItemCard;
