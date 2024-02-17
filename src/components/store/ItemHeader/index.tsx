import { Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
  discountPercentage: number;
}

const ItemHeader = ({ itemName, cost, discountPercentage }: ItemHeaderProps) => {
  return (
    <div className={styles.itemHeaderGroup}>
      <Typography variant="h1/bold" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {itemName}
      </Typography>
      {cost === undefined ? null : (
        <div className={styles.price}>
          <Diamonds count={cost} discount={cost - (cost * discountPercentage) / 100} />
        </div>
      )}
    </div>
  );
};
export default ItemHeader;
