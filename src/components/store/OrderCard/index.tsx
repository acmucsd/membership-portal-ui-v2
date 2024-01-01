import { Typography } from '@/components/common';
import { showToast } from '@/lib';
import { getOrder } from '@/lib/api/StoreAPI';
import { PublicOrder, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { formatDate, formatEventDate } from '@/lib/utils';
import { useEffect, useState } from 'react';
import OrderSummary from '../OrderSummary';
import styles from './style.module.scss';

export const orderStatusName: Record<OrderStatus, string> = {
  [OrderStatus.FULFILLED]: 'Fulfilled',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.PLACED]: 'Placed',
  [OrderStatus.PARTIALLY_FULFILLED]: 'Partially Fulfilled',
  [OrderStatus.PICKUP_MISSED]: 'Pickup Missed',
  [OrderStatus.PICKUP_CANCELLED]: 'Pickup Cancelled',
};

export const orderStatusColor: Record<OrderStatus, string> = {
  // Green: Order completed and picked up.
  [OrderStatus.FULFILLED]: styles.green,
  // Gray: Order completed, no further action needed.
  [OrderStatus.CANCELLED]: styles.gray,
  // Blue: Order pending.
  [OrderStatus.PLACED]: styles.blue,
  [OrderStatus.PARTIALLY_FULFILLED]: styles.blue,
  // Red: Order pending, requires user action.
  [OrderStatus.PICKUP_MISSED]: styles.red,
  [OrderStatus.PICKUP_CANCELLED]: styles.red,
};

interface OrderCardProps {
  order: PublicOrder;
  token: string;
}

const OrderCard = ({ order, token }: OrderCardProps) => {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState<PublicOrderWithItems | null>(null);
  const orderOpen = open && orderData !== null;

  useEffect(() => {
    if (open && orderData === null) {
      // Only run if we haven't fetched the data yet (orderData === null)
      getOrder(token, order.uuid)
        .then(data => setOrderData(data))
        .catch(e => {
          showToast(e.message);
          setOrderData(null);
        });
    }
  }, [open, order.uuid, orderData, token]);

  const statusColor = orderStatusColor[order.status as keyof Record<OrderStatus, string>];
  const statusName = orderStatusName[order.status as keyof Record<OrderStatus, string>];

  return (
    <div className={styles.card}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`${styles.container} ${orderOpen && styles.focused}`}
      >
        <div className={styles.orderInfo}>
          <div className={styles.mobileHeader}>
            {/* Header includes both ORDER PLACED and status for mobile. */}
            <div className={styles.label}>
              <Typography variant="label/small">ORDER PLACED</Typography>
              <Typography variant="body/large" style={{ fontWeight: 700 }} suppressHydrationWarning>
                {formatDate(order.orderedAt, true)}
              </Typography>
            </div>
            <div className={`${styles.orderStatus} ${statusColor} ${styles.mobile}`}>
              <Typography variant="body/medium">{statusName}</Typography>
            </div>
          </div>
          <div className={styles.label}>
            <Typography variant="label/small">PICK UP</Typography>
            <Typography variant="body/large" style={{ fontWeight: 700 }} suppressHydrationWarning>
              {formatEventDate(order.pickupEvent.start, order.pickupEvent.end, true)}
            </Typography>
          </div>
        </div>
        {/* For desktop, status is located at the end of the row. */}
        <div className={`${styles.orderStatus} ${statusColor} ${styles.desktop}`}>
          <Typography variant="body/medium">{statusName}</Typography>
        </div>
      </button>
      {orderOpen && <OrderSummary order={orderData} />}
    </div>
  );
};

export default OrderCard;
