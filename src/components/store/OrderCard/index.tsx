import { Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicOrder, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { formatDate, formatEventDate } from '@/lib/utils';
import Link from 'next/link';
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
  focusedOrder?: PublicOrderWithItems;
}

const OrderCard = ({ order, focusedOrder }: OrderCardProps) => {
  const isOrderFocused = focusedOrder?.uuid === order.uuid;

  return (
    <div className={styles.card}>
      <Link
        className={`${styles.container} ${isOrderFocused && styles.focused}`}
        href={isOrderFocused ? config.myOrdersRoute : `${config.myOrdersRoute}?order=${order.uuid}`}
        scroll={false}
      >
        <div className={styles.orderInfo}>
          <div className={styles.label}>
            <Typography variant="label/small">ORDER PLACED</Typography>
            <Typography variant="body/large" style={{ fontWeight: 700 }} suppressHydrationWarning>
              {formatDate(order.orderedAt, true)}
            </Typography>
          </div>
          <div className={styles.label}>
            <Typography variant="label/small">PICK UP</Typography>
            <Typography variant="body/large" style={{ fontWeight: 700 }} suppressHydrationWarning>
              {formatEventDate(order.pickupEvent.start, order.pickupEvent.end, true)}
            </Typography>
          </div>
        </div>
        <div className={`${styles.orderStatus} ${orderStatusColor[order.status]}`}>
          <Typography variant="body/medium">{orderStatusName[order.status]}</Typography>
        </div>
      </Link>
      {isOrderFocused && <OrderSummary order={focusedOrder} />}
    </div>
  );
};

export default OrderCard;
