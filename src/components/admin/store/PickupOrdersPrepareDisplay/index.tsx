import { Typography } from '@/components/common';
import { PublicOrderItemWithQuantity, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { getOrderItemQuantities } from '@/lib/utils';
import { useMemo } from 'react';
import styles from './style.module.scss';

interface PickupOrdersDisplayPrepareProps {
  orders: PublicOrderWithItems[];
}

const itemToString = (item: PublicOrderItemWithQuantity): string => {
  if (item.option.metadata !== null)
    return `${item.option.item.itemName} (${item.option.metadata.type}: ${item.option.metadata.value})`;
  return item.option.item.itemName;
};

const PickupOrdersPrepareDisplay = ({ orders }: PickupOrdersDisplayPrepareProps) => {
  const itemBreakdown: PublicOrderItemWithQuantity[] = useMemo(() => {
    // Concatenate all items together into one large order to display the item breakdown.
    const allItems = orders.flatMap(a => a.items);
    return getOrderItemQuantities({ items: allItems, ignoreFulfilled: true });
  }, [orders]);

  return (
    <div className={styles.container}>
      <div className={styles.breakdown}>
        <Typography variant="h3/bold">Item Breakdown</Typography>
        <table className={styles.table}>
          <th>
            <Typography variant="h4/bold">Quantity</Typography>
          </th>
          <th>
            <Typography variant="h4/bold">Item</Typography>
          </th>
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
        </table>
      </div>
      <div className={styles.breakdown}>
        <Typography variant="h3/bold">User Breakdown</Typography>
        <table className={styles.table}>
          <th>
            <Typography variant="h4/bold">User</Typography>
          </th>
          <th>
            <Typography variant="h4/bold">Items</Typography>
          </th>
          {orders.map(order => {
            const itemQuantities = getOrderItemQuantities({
              items: order.items,
            });
            return (
              <tr key={order.uuid}>
                <td>
                  <Typography variant="h5/regular">{`${order.user.firstName} ${order.user.lastName}`}</Typography>
                </td>
                <td>
                  <ul className={styles.itemList}>
                    {itemQuantities.map(item => (
                      <li key={item.uuid}>
                        <Typography variant="h5/regular">{`${item.fulfilled ? '✅' : '❌'} ${
                          item.quantity
                        } x ${itemToString(item)}`}</Typography>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default PickupOrdersPrepareDisplay;
