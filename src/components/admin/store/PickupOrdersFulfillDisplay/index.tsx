import { Typography } from '@/components/common';
import { PublicOrderWithItems } from '@/lib/types/apiResponses';

interface PickupOrdersFulfillDisplayProps {
  orders: PublicOrderWithItems[];
}

const PickupOrdersFulfillDisplay = ({ orders }: PickupOrdersFulfillDisplayProps) => {
  return (
    <div>
      {orders.map(order => (
        <div key={order.uuid}>
          <Typography variant="h3/regular">{`${order.user.firstName} ${order.user.lastName} (${order.status})`}</Typography>
        </div>
      ))}
    </div>
  );
};

export default PickupOrdersFulfillDisplay;
