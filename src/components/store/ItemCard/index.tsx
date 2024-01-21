import Diamonds from '@/components/store/Diamonds';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface CommonOptions {
  image: string;
  title: string;
  href: string;
  className?: string;
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
const ItemCard = ({
  image,
  title,
  href,
  className,
  children,
  ...props
}: PropsWithChildren<ItemCardProps>) => {
  return (
    <article className={`${styles.itemCard} ${className}`}>
      <Link href={href} className={styles.linkWrapper}>
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
      </Link>
      {children && <div className={styles.icons}>{children}</div>}
    </article>
  );
};

export default ItemCard;
