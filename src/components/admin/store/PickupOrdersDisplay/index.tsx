import PickupOrdersPrepareDisplay from '@/components/admin/store/PickupOrdersDisplay/PickupOrdersPrepareDisplay';
import { Typography } from '@/components/common';
import { PublicOrderWithItems } from '@/lib/types/apiResponses';

interface PickupOrdersDisplayProps {
  mode: 'prepare' | 'fulfill';
  orders: PublicOrderWithItems[];
}

const PickupOrdersDisplay = ({ mode, orders }: PickupOrdersDisplayProps) => {
  if (mode === 'prepare') {
    return <PickupOrdersPrepareDisplay orders={orders} />;
  }
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

export default PickupOrdersDisplay;
