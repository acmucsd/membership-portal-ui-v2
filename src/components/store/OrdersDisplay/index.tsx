import { Typography } from '@/components/common';
import OrderCard from '@/components/store/OrderCard';
import { PublicOrder, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

interface OrdersDisplayProps {
  orders: PublicOrder[];
  futurePickupEvents: PublicOrderPickupEvent[];
}

const OrdersDisplay = ({ orders, futurePickupEvents }: OrdersDisplayProps) => {
  if (orders.length === 0) {
    return <Typography variant="body/large">No orders placed!</Typography>;
  }
  return (
    <div className={styles.container}>
      {orders.map(order => (
        <OrderCard key={order.uuid} order={order} futurePickupEvents={futurePickupEvents} />
      ))}
    </div>
  );
};

export default OrdersDisplay;
