import { Button, Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import { PublicOrderItemWithQuantity, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { capitalize } from '@/lib/utils';
import Image from 'next/image';
import styles from './style.module.scss';

interface OrderSummaryProps {
  order: PublicOrderWithItems;
}

const isOrderActionable = ({ status, pickupEvent }: PublicOrderWithItems): boolean => {
  if (status === OrderStatus.CANCELLED || status === OrderStatus.FULFILLED) {
    // If the order is cancelled by the user or fulfilled, no further action can be taken.
    return false;
  }
  // If there's less than two days before the pickup event, merch distributors are already
  // preparing the order. Thus, the order can't be rescheduled/cancelled at this time.
  const now = new Date();
  const eventStart = new Date(pickupEvent.start);
  eventStart.setDate(eventStart.getDate() - 2);
  if (now > eventStart) {
    return false;
  }
  return true;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const itemMap = new Map<string, PublicOrderItemWithQuantity>();

  order.items.forEach(item => {
    const existingItem = itemMap.get(item.option.uuid);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      itemMap.set(item.option.uuid, { ...item, quantity: 1 });
    }
  });

  const updatedItems = Array.from(itemMap.values());

  const totalCostWithoutDiscount = updatedItems.reduce((cost, item) => {
    return cost + item.quantity * item.option.price;
  }, 0);

  const actionable = isOrderActionable(order);

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
              <Diamonds
                count={item.option.price * item.quantity}
                discount={item.salePriceAtPurchase}
              />
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
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <Button onClick={() => {}}>Pickup Details</Button>
          {actionable && (
            <>
              <Button onClick={() => {}}>Reschedule Pickup</Button>
              <Button onClick={() => {}} destructive>
                Cancel Order
              </Button>
            </>
          )}
        </div>
        <div className={styles.totalPrice}>
          <Typography variant="h4/bold">Total: </Typography>
          <Diamonds
            count={totalCostWithoutDiscount}
            discount={order.totalCost}
            className={styles.totalDiamonds}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
