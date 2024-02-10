import Diamonds from '@/components/store/Diamonds';
import EditButton from '@/components/store/EditButton';
import HiddenIcon from '@/components/store/HiddenIcon';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
  discountPercentage: number | undefined;
  uuid?: string;
  showEdit?: boolean;
  isHidden?: boolean;
}

const ItemHeader = ({
  itemName,
  cost,
  discountPercentage = 0,
  uuid,
  showEdit,
  isHidden,
}: ItemHeaderProps) => {
  return (
    <div className={styles.itemHeaderGroup}>
      <h1>
        {itemName}
        {uuid && showEdit ? <EditButton type="item" uuid={uuid} /> : null}
        {isHidden ? <HiddenIcon type="item" /> : null}
      </h1>
      {cost === undefined ? null : (
        <div className={styles.price}>
          <Diamonds
            count={cost}
            discount={discountPercentage !== 0 ? cost * (1 - discountPercentage / 100) : undefined}
          />
        </div>
      )}
    </div>
  );
};
export default ItemHeader;
