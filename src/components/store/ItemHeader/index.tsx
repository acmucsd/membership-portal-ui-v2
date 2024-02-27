import { Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import EditButton from '@/components/store/EditButton';
import HiddenIcon from '@/components/store/HiddenIcon';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
  discountPercentage: number;
  uuid?: string;
  showEdit?: boolean;
  isHidden?: boolean;
}

const ItemHeader = ({
  itemName,
  cost,
  discountPercentage,
  uuid,
  showEdit,
  isHidden,
}: ItemHeaderProps) => {
  return (
    <div className={styles.itemHeaderGroup}>
      <Typography variant="h1/bold" className={styles.itemName}>
        <span>{itemName}</span>
        {uuid && showEdit ? <EditButton type="item" uuid={uuid} /> : null}
        {isHidden ? <HiddenIcon type="item" /> : null}
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
