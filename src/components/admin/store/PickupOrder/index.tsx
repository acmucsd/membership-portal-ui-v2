import { Button, Typography } from '@/components/common';
import { OrderStatusIndicator } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import { UUID } from '@/lib/types';
import { PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { getOrderItemQuantities, itemToString, reportError } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';

interface PickupOrderProps {
  token: string;
  canFulfill: boolean;
  order: PublicOrderWithItems;
  onOrderUpdate: (orders: PublicOrderWithItems) => void;
}

const PickupOrder = ({ token, canFulfill, order, onOrderUpdate }: PickupOrderProps) => {
  const itemQuantities = getOrderItemQuantities(order.items);
  const [unselected, setUnselected] = useState(new Set<UUID>());

  return (
    <tr className={styles.row}>
      <td>
        <Typography variant="h5/regular">{`${order.user.firstName} ${order.user.lastName}`}</Typography>
        <OrderStatusIndicator orderStatus={order.status} />
        {canFulfill ? (
          <Button
            size="small"
            onClick={async () => {
              try {
                const items = order.items.filter(item => !unselected.has(item.uuid));
                const newOrder = await StoreAPI.fulfillOrderPickup(token, order.uuid, items);
                const itemUuids = items.map(item => item.uuid);
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
            Fulfill {unselected.size > 0 ? 'Selected' : 'All'}
          </Button>
        ) : null}
      </td>
      <td>
        <ul className={styles.itemList}>
          {itemQuantities.map(item => {
            return (
              <li key={item.uuids[0]}>
                <Typography variant="h5/regular">
                  {`${item.quantity} x ${itemToString(item)}`}{' '}
                  {(order.status === OrderStatus.FULFILLED ||
                    order.status === OrderStatus.PARTIALLY_FULFILLED) &&
                  !item.fulfilled ? (
                    <span className={styles.notFulfilled}>Not fulfilled</span>
                  ) : null}
                </Typography>
                {canFulfill
                  ? item.uuids.map(uuid => (
                      <input
                        key={uuid}
                        type="checkbox"
                        checked={!unselected.has(uuid)}
                        onChange={e => {
                          const copy = new Set(unselected);
                          if (e.currentTarget.checked) {
                            copy.delete(uuid);
                          } else {
                            copy.add(uuid);
                          }
                          setUnselected(copy);
                        }}
                      />
                    ))
                  : null}
              </li>
            );
          })}
        </ul>
      </td>
    </tr>
  );
};

export default PickupOrder;
