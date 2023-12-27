import { Typography } from '@/components/common';
import { PublicOrder } from '@/lib/types/apiResponses';

interface OrderCardProps {
  order: PublicOrder;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div>
      <Typography variant="body/large">Order Placed</Typography>
      <Typography variant="body/large">{order.orderedAt}</Typography>
      <Typography variant="body/large">Pick Up</Typography>
      <Typography variant="body/large">
        {order.pickupEvent.start} - {order.pickupEvent.end}
      </Typography>
      <Typography variant="body/large">{order.status}</Typography>
    </div>
  );
};

export default OrderCard;
