import BlueDiamond from '@/public/assets/icons/blue-diamond.svg';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
}

const ItemHeader = ({ itemName, cost }: ItemHeaderProps) => {
  return (
    <div className={styles.itemHeaderGroup}>
      <h1>{itemName}</h1>
      <div className={styles.price}>
        <p>{cost || 'Select Size Option First'}</p>
        <BlueDiamond />
      </div>
    </div>
  );
};
export default ItemHeader;
