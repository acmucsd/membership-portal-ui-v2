import { Typography } from '@/components/common';
import { OrderStatus } from '@/lib/types/enums';
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

interface OrderStatusIndicatorProps {
  orderStatus: OrderStatus;
  className?: string;
}

const OrderStatusIndicator = ({ orderStatus, className = '' }: OrderStatusIndicatorProps) => {
  return (
    <div className={`${styles.orderStatus} ${orderStatusColor[orderStatus]} ${className}`}>
      <Typography variant="body/medium">{orderStatusName[orderStatus]}</Typography>
    </div>
  );
};

export default OrderStatusIndicator;
