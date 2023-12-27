import { Typography } from '@/components/common';
import OrderCard from '@/components/store/OrderCard';
import { PublicOrder } from '@/lib/types/apiResponses';

interface OrdersDisplayProps {
  orders: PublicOrder[];
}

const OrdersDisplay = ({ orders }: OrdersDisplayProps) => {
  if (orders.length === 0) {
    return <Typography variant="body/large">No orders placed!</Typography>;
  }
  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.uuid} order={order} />
      ))}
    </div>
  );
};

export default OrdersDisplay;
