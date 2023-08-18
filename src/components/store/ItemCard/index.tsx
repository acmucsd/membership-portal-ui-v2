import Diamonds from '@/components/store/Diamonds';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface CommonOptions {
  image: string;
  title: string;
  href?: string;
}

interface StoreItemOptions {
  cost: number;
  outOfStock?: boolean;
}

interface CollectionOptions {
  description: string;
}

type ItemCardProps = (StoreItemOptions | CollectionOptions) & CommonOptions;

/**
 * A card that represents either
 * - a store item that costs `cost` diamonds (optional `outOfStock`), or
 * - a collection with a `description`.
 */
const ItemCard = ({ image, title, href, ...props }: ItemCardProps) => {
  const Card = href ? Link : 'article';
  return (
    <Card href={href ?? ''} className={styles.itemCard}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill />
      </div>
      <div className={styles.details}>
        <p className={styles.title}>{title}</p>
        {'description' in props && <p>{props.description}</p>}
        {'cost' in props && (
          <p className={styles.cost}>
            <Diamonds count={props.cost} />
            &nbsp;
            {props.outOfStock && <span className={styles.outOfStock}>Out of stock</span>}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ItemCard;
