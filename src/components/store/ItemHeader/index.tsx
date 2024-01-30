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
      {cost === undefined ? null : (
        <div className={styles.price}>
          <Diamonds count={cost} />
        </div>
      )}
    </div>
  );
};
export default ItemHeader;
