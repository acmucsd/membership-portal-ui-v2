import { Typography } from '@/components/common';
import { getOrder } from '@/lib/api/StoreAPI';
import { StoreManager } from '@/lib/managers';
import { getClientCookie } from '@/lib/services/CookieService';
import {
  PublicOrder,
  PublicOrderPickupEvent,
  PublicOrderWithItems,
} from '@/lib/types/apiResponses';
import { CookieType, OrderStatus } from '@/lib/types/enums';
import { formatDate, formatEventDate, reportError } from '@/lib/utils';
import { useEffect, useState } from 'react';
import OrderSummary from '../OrderSummary';
import styles from './style.module.scss';

export const orderStatusName: { [_ in OrderStatus]: string } = {
  [OrderStatus.FULFILLED]: 'Fulfilled',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.PLACED]: 'Placed',
  [OrderStatus.PARTIALLY_FULFILLED]: 'Partially Fulfilled',
  [OrderStatus.PICKUP_MISSED]: 'Pickup Missed',
  [OrderStatus.PICKUP_CANCELLED]: 'Pickup Cancelled',
};

export const orderStatusColor: { [_ in OrderStatus]: string } = {
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
  futurePickupEvents: PublicOrderPickupEvent[];
}

const OrderCard = ({ order, futurePickupEvents }: OrderCardProps) => {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState<PublicOrderWithItems | null>(null);
  const [pickupEvent, setPickupEvent] = useState<PublicOrderPickupEvent>(order.pickupEvent);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status);
  const orderOpen = open && orderData !== null;

  useEffect(() => {
    if (open && orderData === null) {
      // Only run if we haven't fetched the data yet (orderData === null)
      const AUTH_TOKEN = getClientCookie(CookieType.ACCESS_TOKEN);
      getOrder(AUTH_TOKEN, order.uuid)
        .then(data => setOrderData(data))
        .catch((e): void => {
          reportError('Error loading order!', e);
          setOrderData(null);
        });
    }
  }, [open, order.uuid, orderData]);

  const cancelOrder = async () => {
    await StoreManager.cancelMerchOrder(order.uuid);
    setOrderStatus(OrderStatus.CANCELLED);
  };

  const rescheduleOrderPickup = async (pickup: PublicOrderPickupEvent) => {
    await StoreManager.rescheduleOrderPickup(order.uuid, pickup.uuid);
    setPickupEvent(pickup);
  };

  const statusColor = orderStatusColor[orderStatus];
  const statusName = orderStatusName[orderStatus];

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
              {formatEventDate(pickupEvent.start, pickupEvent.end, true)}
            </Typography>
          </div>
        </div>
        {/* For desktop, status is located at the end of the row. */}
        <div className={`${styles.orderStatus} ${statusColor} ${styles.desktop}`}>
          <Typography variant="body/medium">{statusName}</Typography>
        </div>
      </button>
      {orderOpen ? (
        <OrderSummary
          order={orderData}
          orderStatus={orderStatus}
          futurePickupEvents={futurePickupEvents}
          pickupEvent={pickupEvent}
          reschedulePickupEvent={rescheduleOrderPickup}
          cancelOrder={cancelOrder}
        />
      ) : null}
    </div>
  );
};

export default OrderCard;
