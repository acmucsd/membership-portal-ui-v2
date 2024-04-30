import { Button, Typography } from '@/components/common';
import { OrderStatusIndicator } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import { PublicOrderItemWithQuantity, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { getOrderItemQuantities, reportError } from '@/lib/utils';
import styles from './style.module.scss';

interface PickupOrderProps {
  token: string;
  canFulfill: boolean;
  order: PublicOrderWithItems;
  onOrderUpdate: (orders: PublicOrderWithItems) => void;
}

const itemToString = (item: PublicOrderItemWithQuantity): string => {
  if (item.option.metadata !== null)
    return `${item.option.item.itemName} (${item.option.metadata.type}: ${item.option.metadata.value})`;
  return item.option.item.itemName;
};

const PickupOrder = ({ token, canFulfill, order, onOrderUpdate }: PickupOrderProps) => {
  const showFulfill = canFulfill && order.status === OrderStatus.PLACED;
  const itemQuantities = getOrderItemQuantities(order.items);
  return (
    <tr className={styles.row}>
      <td>
        <Typography variant="h5/regular">{`${order.user.firstName} ${order.user.lastName}`}</Typography>
        <OrderStatusIndicator orderStatus={order.status} />
        {showFulfill && itemQuantities.length > 1 ? (
          <Button
            size="small"
            onClick={async () => {
              try {
                const newOrder = await StoreAPI.fulfillOrderPickup(token, order.uuid, order.items);
                const itemUuids = order.items.map(item => item.uuid);
                onOrderUpdate({
                  ...newOrder,
                  items: order.items.map(item =>
                    itemUuids.includes(item.uuid) ? { ...item, fulfilled: true } : item
                  ),
                });
              } catch (error: unknown) {
                reportError('Failed to fulfill order', error);
              }
            }}
          >
            Fulfill
          </Button>
        ) : null}
      </td>
      <td>
        <ul className={styles.itemList}>
          {itemQuantities.map(item => {
            return (
              <li key={item.uuid}>
                <Typography variant="h5/regular">{`${item.quantity} x ${itemToString(
                  item
                )}`}</Typography>
              </li>
            );
          })}
        </ul>
      </td>
    </tr>
  );
};

export default PickupOrder;
