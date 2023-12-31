import BlueDiamond from '@/public/assets/icons/blue-diamond.svg';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

interface ItemHeaderProps {
  itemName: string;
  cost: number | undefined;
  // Justification for disabling rules: This seems to be a false positive.
  // https://stackoverflow.com/q/63767199/
  // eslint-disable-next-line no-unused-vars
}

const ItemHeader = ({ itemName, cost }: ItemHeaderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

// Links for knowledge:
// https://medium.com/@vincent.bocquet/typescript-with-react-usestate-hook-f701309384a
