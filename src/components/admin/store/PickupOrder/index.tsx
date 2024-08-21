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
  const [selected, setSelected] = useState(new Set<UUID>());

  const handleFulfillOrder = async () => {
    try {
      const items = order.items.filter(item => selected.has(item.uuid));
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
  };

  return (
    <tr className={styles.row}>
      <td>
        <Typography variant="h5/regular">
          {order.user.firstName} {order.user.lastName}
        </Typography>
        <OrderStatusIndicator orderStatus={order.status} />
      </td>
      <td>
        <ul className={styles.itemList}>
          {itemQuantities.map(item => {
            let badge = null;
            if (item.fulfilled) {
              badge = (
                <span className={styles.fulfilled} title="Fulfilled">
                  ✅
                </span>
              );
            } else if (
              order.status === OrderStatus.FULFILLED ||
              order.status === OrderStatus.PARTIALLY_FULFILLED
            ) {
              badge = (
                <span className={styles.notFulfilled} title="Not fulfilled">
                  ❌
                </span>
              );
            }
            return (
              <li key={item.uuids[0]}>
                <label>
                  {canFulfill && !item.fulfilled ? (
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      onChange={e => {
                        setSelected(
                          new Set(
                            e.currentTarget.checked
                              ? [...Array.from(selected), ...item.uuids]
                              : Array.from(selected).filter(uuid => !item.uuids.includes(uuid))
                          )
                        );
                      }}
                    />
                  ) : null}
                  <Typography variant="h5/regular" component="span">
                    {item.quantity} x {itemToString(item)} {badge}
                  </Typography>
                </label>
              </li>
            );
          })}
        </ul>
        {canFulfill ? (
          <Button size="small" onClick={handleFulfillOrder}>
            Fulfill {selected.size} item{selected.size === 1 ? '' : 's'}
          </Button>
        ) : null}
      </td>
    </tr>
  );
};

export default PickupOrder;
