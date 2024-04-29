import { Button, Typography } from '@/components/common';
import { OrderStatusIndicator } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import {
  PublicOrder,
  PublicOrderItem,
  PublicOrderItemWithQuantity,
  PublicOrderWithItems,
} from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { getOrderItemQuantities, reportError } from '@/lib/utils';
import { useMemo } from 'react';
import styles from './style.module.scss';

interface PickupOrdersDisplayPrepareProps {
  token: string;
  orders: PublicOrderWithItems[];
  onOrderUpdate: (orders: PublicOrderWithItems[]) => void;
}

const itemToString = (item: PublicOrderItemWithQuantity): string => {
  if (item.option.metadata !== null)
    return `${item.option.item.itemName} (${item.option.metadata.type}: ${item.option.metadata.value})`;
  return item.option.item.itemName;
};

const PickupOrdersPrepareDisplay = ({
  token,
  orders,
  onOrderUpdate,
}: PickupOrdersDisplayPrepareProps) => {
  const itemBreakdown: PublicOrderItemWithQuantity[] = useMemo(() => {
    // Concatenate all items together into one large order to display the item breakdown.
    const allItems = orders.flatMap(a => a.items);
    return getOrderItemQuantities(allItems);
  }, [orders]);

  const fulfillItems = async (order: PublicOrder, items: PublicOrderItem[]): Promise<void> => {
    try {
      const newOrder = await StoreAPI.fulfillOrderPickup(token, order.uuid, items);
      onOrderUpdate(
        orders.map(order => (order.uuid === newOrder.uuid ? { ...order, ...newOrder } : order))
      );
    } catch (error: unknown) {
      reportError('Failed to fulfill order', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breakdown}>
        <Typography variant="h3/bold">Item Breakdown</Typography>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <Typography variant="h4/bold">Quantity</Typography>
              </th>
              <th>
                <Typography variant="h4/bold">Item</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map(item => {
              return (
                <tr key={item.uuid}>
                  <td>
                    <Typography variant="h5/regular">{item.quantity}</Typography>
                  </td>
                  <td>
                    <Typography variant="h5/regular">{itemToString(item)}</Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.breakdown}>
        <Typography variant="h3/bold">User Breakdown</Typography>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <Typography variant="h4/bold">User</Typography>
              </th>
              <th>
                <Typography variant="h4/bold">Items</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const canFulfill =
                order.status === OrderStatus.PLACED ||
                order.status === OrderStatus.PARTIALLY_FULFILLED;
              const itemQuantities = getOrderItemQuantities(order.items);
              return (
                <tr key={order.uuid}>
                  <td>
                    <Typography variant="h5/regular">{`${order.user.firstName} ${order.user.lastName}`}</Typography>
                    <OrderStatusIndicator orderStatus={order.status} />
                    {canFulfill && itemQuantities.length > 1 ? (
                      <Button
                        size="small"
                        onClick={() =>
                          fulfillItems(
                            order,
                            order.items.filter(item => !item.fulfilled)
                          )
                        }
                      >
                        Fulfill All
                      </Button>
                    ) : null}
                  </td>
                  <td>
                    <ul className={styles.itemList}>
                      {itemQuantities.map(item => {
                        const fulfillButton = item.fulfilled ? (
                          <strong>Fulfilled</strong>
                        ) : (
                          <Button size="small" onClick={() => fulfillItems(order, [item])}>
                            Fulfill
                          </Button>
                        );
                        return (
                          <li key={item.uuid}>
                            <Typography variant="h5/regular">{`${item.quantity} x ${itemToString(
                              item
                            )}`}</Typography>
                            {canFulfill ? fulfillButton : null}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupOrdersPrepareDisplay;
