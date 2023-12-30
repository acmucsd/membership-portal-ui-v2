import { Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import { PublicOrderItemWithQuantity, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { capitalize } from '@/lib/utils';
import Image from 'next/image';
import styles from './style.module.scss';

interface OrderSummaryProps {
  order: PublicOrderWithItems;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const itemMap = new Map<string, PublicOrderItemWithQuantity>();

  order.items.forEach(item => {
    const existingItem = itemMap.get(item.option.uuid);

    if (existingItem) {
      existingItem.quantity += 1;

      itemMap.set(existingItem.option.uuid, existingItem);
    } else {
      itemMap.set(item.option.uuid, { ...item, quantity: 1 });
    }
  });

  const updatedItems = Array.from(itemMap, ([, value]) => value);

  return (
    <div className={styles.container}>
      {updatedItems.map(item => (
        <div key={item.uuid} className={styles.itemInfo}>
          <div className={styles.image}>
            <Image
              src={item.option.item.picture}
              style={{ objectFit: 'cover' }}
              sizes="9.375rem"
              alt="Store item picture"
              fill
            />
          </div>
          <div className={styles.itemSummary}>
            <Typography variant="h4/bold">{item.option.item.itemName}</Typography>
            <div className={styles.label}>
              <Typography variant="h5/bold">Price: </Typography>
              <Diamonds count={item.salePriceAtPurchase} />
            </div>
            <div className={styles.label}>
              <Typography variant="h5/bold">Quantity: </Typography>
              <Typography variant="h5/regular">{item.quantity}</Typography>
            </div>
            {item.option.metadata && (
              <div className={styles.label}>
                <Typography variant="h5/bold">{`${capitalize(
                  item.option.metadata.type
                )}: `}</Typography>
                <Typography variant="h5/regular">{item.option.metadata.value}</Typography>
              </div>
            )}
          </div>
        </div>
      ))}
      <hr className={styles.divider} />
      <div className={styles.totalPrice}>
        <Typography variant="h4/bold">Total: </Typography>
        <Diamonds count={order.totalCost} className={styles.totalDiamonds} />
      </div>
    </div>
  );
};

export default OrderSummary;
