import Diamonds from '@/components/store/Diamonds';
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
        {cost === undefined ? <p>Select Size Option First For Price</p> : <Diamonds count={cost} />}
      </div>
    </div>
  );
};
export default ItemHeader;
