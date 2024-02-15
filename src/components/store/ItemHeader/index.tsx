import { Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
}

const ItemHeader = ({ itemName, cost }: ItemHeaderProps) => {
  return (
    <div className={styles.itemHeaderGroup}>
      <Typography variant="h1/bold" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {itemName}
      </Typography>
      {cost === undefined ? null : (
        <div className={styles.price}>
          <Diamonds count={cost} />
        </div>
      )}
    </div>
  );
};
export default ItemHeader;
