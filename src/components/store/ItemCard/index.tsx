import Diamonds from '@/components/store/Diamonds';
import NoImage from '@/public/assets/graphics/cat404.png';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface CommonOptions {
  images: string[];
  title: string;
  href: string;
  className?: string;
}

interface StoreItemOptions {
  cost: number;
  discountPercentage: number;
  outOfStock: boolean;
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
  images,
  title,
  href,
  className,
  children,
  ...props
}: PropsWithChildren<ItemCardProps>) => {
  const [first = NoImage, second = first] = images;

  return (
    <article className={`${styles.itemCard} ${className}`}>
      <Link href={href} className={styles.linkWrapper}>
        <div
          className={styles.imageWrapper}
          onPointerMove={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              '--mouse-x',
              `${((e.clientX - rect.left) / rect.width) * 100}%`
            );
            e.currentTarget.style.setProperty(
              '--mouse-y',
              `${((e.clientY - rect.top) / rect.width) * 100}%`
            );
          }}
        >
          <Image src={first} alt={title} fill />
          <Image className={styles.second} src={second} alt="" aria-hidden fill />
        </div>
        <div className={styles.details}>
          <p className={styles.title}>{title}</p>
          {'description' in props ? <p>{props.description}</p> : null}
          {'cost' in props ? (
            <p className={styles.cost}>
              <Diamonds
                count={props.cost}
                discount={
                  props.discountPercentage !== 0
                    ? props.cost * (1 - props.discountPercentage / 100)
                    : undefined
                }
              />
              &nbsp;
              {props.outOfStock ? <span className={styles.outOfStock}>Out of stock</span> : null}
            </p>
          ) : null}
        </div>
      </Link>
      {children ? <div className={styles.icons}>{children}</div> : null}
    </article>
  );
};

export default ItemCard;
