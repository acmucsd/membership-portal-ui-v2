import Image from 'next/image';
import styles from './style.module.scss';

const numberFormat = new Intl.NumberFormat('en-US');

interface ItemCardProps {
  image: string;
  title: string;
  cost: number;
  inStock?: boolean;
}

const ItemCard = ({ image, title, cost, inStock = true }: ItemCardProps) => {
  return (
    <div className={styles.itemCard}>
      <Image src={image} alt={title} width={400} height={400} />
      <div className={styles.details}>
        <p className={styles.title}>{title}</p>
        <p className={styles.cost}>
          {numberFormat.format(cost)}
          <span className={styles.diamond} />
          {!inStock && <span className={styles.outOfStock}>Out of stock</span>}
        </p>
      </div>
    </div>
  );
};

export default ItemCard;
