import { Button, Typography } from '@/components/common';
import { StoreAPI } from '@/lib/api';
import { PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';

interface PickupOrdersFulfillDisplayProps {
  token: string;
  orders: PublicOrderWithItems[];
  onOrderUpdate: (orders: PublicOrderWithItems[]) => void;
}

const PickupOrdersFulfillDisplay = ({
  token,
  orders,
  onOrderUpdate,
}: PickupOrdersFulfillDisplayProps) => {
  return (
    <div>
      {orders.map(order => (
        <div key={order.uuid}>
          <Typography variant="h3/regular">{`${order.user.firstName} ${order.user.lastName} (${order.status})`}</Typography>
          {order.status === OrderStatus.PLACED ||
          order.status === OrderStatus.PARTIALLY_FULFILLED ? (
            <Button
              onClick={async () => {
                try {
                  const newOrder = await StoreAPI.fulfillOrderPickup(
                    token,
                    order.uuid,
                    order.items
                  );
                  onOrderUpdate(
                    orders.map(order =>
                      order.uuid === newOrder.uuid ? { ...order, ...newOrder } : order
                    )
                  );
                } catch (error: unknown) {
                  reportError('Failed to fulfill order', error);
                }
              }}
            >
              Fulfill
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default PickupOrdersFulfillDisplay;
