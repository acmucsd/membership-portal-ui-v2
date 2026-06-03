import { Button, Typography } from '@/components/common';
import { OrderEditModal, OrderStatusIndicator } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import { UUID } from '@/lib/types';
import { PublicOrderItem, PublicOrderWithItems } from '@/lib/types/apiResponses';
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
  const [openEditOrderModal, setOpenEditOrderModal] = useState(false);

  const handleUpdateFulfillment = async (fulfilled: boolean, items: PublicOrderItem[]) => {
    try {
      const newOrder = await (fulfilled
        ? StoreAPI.fulfillOrderPickup(token, order.uuid, items)
        : StoreAPI.unfulfillOrderPickup(token, order.uuid, items));
      const itemUuids = items.map(item => item.uuid);
      onOrderUpdate({
        ...newOrder,
        items: order.items.map(item =>
          itemUuids.includes(item.uuid) ? { ...item, fulfilled } : item
        ),
      });
    } catch (error: unknown) {
      reportError(`Failed to ${fulfilled ? 'fulfill' : 'unfulfill'} order`, error);
    }
  };

  const handleFulfillOrder = async (items: PublicOrderItem[]) => {
    await handleUpdateFulfillment(true, items);
  };

  const handleUnfulfillOrder = async (items: PublicOrderItem[]) => {
    await handleUpdateFulfillment(false, items);
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
          <Button size="small" onClick={()=>{handleFulfillOrder(order.items.filter(item => selected.has(item.uuid)))}}>
            Fulfill {selected.size} item{selected.size === 1 ? '' : 's'}
          </Button>
        ) : null}
      </td>
      <td>
        <Button
          size="small"
          onClick={() => {
            setOpenEditOrderModal(true);
          }}
        >
          Edit Order
        </Button>
        <OrderEditModal
          open={openEditOrderModal}
          token={token}
          order={order}
          itemQuantities={itemQuantities}
          onOrderUpdate={onOrderUpdate}
          handleFulfillOrder={handleFulfillOrder}
          handleUnfulfillOrder={handleUnfulfillOrder}
          onClose={() => {
            setOpenEditOrderModal(false);
          }}
        />
      </td>
    </tr>
  );
};

export default PickupOrder;
