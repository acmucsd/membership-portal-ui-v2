import Diamonds from '@/components/store/Diamonds';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface ItemCardProps {
  image: string;
  title: string;
  cost: number;
  href?: string;
  inStock?: boolean;
}

const ItemCard = ({ image, title, cost, href, inStock = true }: ItemCardProps) => {
  const Card = href ? Link : 'article';
  return (
    <Card href={href ?? ''} className={styles.itemCard}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill />
      </div>
      <div className={styles.details}>
        <p className={styles.title}>{title}</p>
        <p className={styles.cost}>
          <Diamonds count={cost} />
          {!inStock && <span className={styles.outOfStock}>Out of stock</span>}
        </p>
      </div>
    </Card>
  );
};

export default ItemCard;
