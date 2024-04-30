import PickupOrder from '@/components/admin/store/PickupOrder';
import { Typography } from '@/components/common';
import { PublicOrderItemWithQuantity, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { getOrderItemQuantities } from '@/lib/utils';
import { useMemo } from 'react';
import styles from './style.module.scss';

interface PickupOrdersDisplayPrepareProps {
  token: string;
  canFulfill: boolean;
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
  canFulfill,
  orders,
  onOrderUpdate,
}: PickupOrdersDisplayPrepareProps) => {
  const itemBreakdown: PublicOrderItemWithQuantity[] = useMemo(() => {
    // Concatenate all items together into one large order to display the item breakdown.
    const allItems = orders.flatMap(a => a.items);
    return getOrderItemQuantities(allItems);
  }, [orders]);

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
            {orders.map(order => (
              <PickupOrder
                canFulfill={canFulfill}
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
