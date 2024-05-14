import PickupOrder from '@/components/admin/store/PickupOrder';
import { Typography } from '@/components/common';
import { PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { OrderItemQuantity, getOrderItemQuantities, itemToString } from '@/lib/utils';
import { useMemo } from 'react';
import styles from './style.module.scss';

interface PickupOrdersDisplayPrepareProps {
  token: string;
  canFulfill: boolean;
  orders: PublicOrderWithItems[];
  onOrderUpdate: (orders: PublicOrderWithItems[]) => void;
}

const PickupOrdersPrepareDisplay = ({
  token,
  canFulfill,
  orders,
  onOrderUpdate,
}: PickupOrdersDisplayPrepareProps) => {
  const itemBreakdown: OrderItemQuantity[] = useMemo(() => {
    // Concatenate all items together into one large order to display the item breakdown.
    const allItems = orders.flatMap(a => a.items);
    return getOrderItemQuantities(allItems, { ignoreFulfilled: true });
  }, [orders]);

  const sorted = useMemo(
    () =>
      [...orders].sort((a, b) => {
        if (a.status !== b.status) {
          // Sort by PLACED first
          return (
            (b.status === OrderStatus.PLACED ? 1 : 0) - (a.status === OrderStatus.PLACED ? 1 : 0)
          );
        }
        // Get the latest pickup time. Default to order time.
        const aTime = a.items.reduce((acc, curr) => {
          if (!curr.fulfilledAt) {
            return acc;
          }
          return Math.max(acc, new Date(curr.fulfilledAt).getTime());
        }, new Date(a.orderedAt).getTime());
        const bTime = b.items.reduce((acc, curr) => {
          if (!curr.fulfilledAt) {
            return acc;
          }
          return Math.max(acc, new Date(curr.fulfilledAt).getTime());
        }, new Date(b.orderedAt).getTime());
        // Sort by soonest first
        return bTime - aTime;
      }),
    [orders]
  );

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
                <tr key={item.uuids[0]}>
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
            {sorted.map(order => (
              <PickupOrder
                canFulfill={canFulfill && order.status === OrderStatus.PLACED}
                order={order}
                onOrderUpdate={newOrder =>
                  onOrderUpdate(
                    orders.map(
                      (order): PublicOrderWithItems =>
                        order.uuid === newOrder.uuid ? newOrder : order
                    )
                  )
                }
                token={token}
                key={order.uuid}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupOrdersPrepareDisplay;
