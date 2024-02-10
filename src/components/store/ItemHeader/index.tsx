import Diamonds from '@/components/store/Diamonds';
import EditButton from '@/components/store/EditButton';
import HiddenIcon from '@/components/store/HiddenIcon';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
  uuid?: string;
  showEdit?: boolean;
  isHidden?: boolean;
}

const ItemHeader = ({ itemName, cost, uuid, showEdit, isHidden }: ItemHeaderProps) => {
  return (
    <div className={styles.itemHeaderGroup}>
      <h1>
        {itemName}
        {uuid && showEdit && <EditButton type="item" uuid={uuid} />}
        {isHidden && <HiddenIcon type="item" />}
      </h1>
      {cost === undefined ? null : (
        <div className={styles.price}>
          <Diamonds count={cost} />
        </div>
      )}
    </div>
  );
};
export default ItemHeader;
