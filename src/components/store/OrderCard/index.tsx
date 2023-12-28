import { Typography } from '@/components/common';
import { PublicOrder } from '@/lib/types/apiResponses';
import { OrderStatus, orderStatusName } from '@/lib/types/enums';
import { formatDate, formatEventDate } from '@/lib/utils';
import styles from './style.module.scss';

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
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.orderInfo}>
        <div className={styles.label}>
          <Typography variant="label/small">ORDER PLACED</Typography>
          <Typography variant="body/large" style={{ fontWeight: 700 }}>
            {formatDate(order.orderedAt, true)}
          </Typography>
        </div>
        <div className={styles.label}>
          <Typography variant="label/small">PICK UP</Typography>
          <Typography variant="body/large" style={{ fontWeight: 700 }}>
            {formatEventDate(order.pickupEvent.start, order.pickupEvent.end, true)}
          </Typography>
        </div>
      </div>
      <div className={`${styles.orderStatus} ${orderStatusColor[order.status]}`}>
        <Typography variant="body/medium">{orderStatusName[order.status]}</Typography>
      </div>
    </div>
  );
};

export default OrderCard;
