import { Button, Typography } from '@/components/common';
import CancelPickupModal from '@/components/store/CancelPickupModal';
import Diamonds from '@/components/store/Diamonds';
import PickupEventPreviewModal from '@/components/store/PickupEventPreviewModal';
import { config } from '@/lib';
import { PublicOrderPickupEvent, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import { capitalize, getDefaultOrderItemPhoto, getOrderItemQuantities } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './style.module.scss';

interface OrderSummaryProps {
  order: PublicOrderWithItems;
  orderStatus: OrderStatus;
  futurePickupEvents: PublicOrderPickupEvent[];
  pickupEvent: PublicOrderPickupEvent;
  reschedulePickupEvent: (pickup: PublicOrderPickupEvent) => Promise<void>;
  cancelOrder: () => Promise<void>;
}

const isOrderActionable = (status: OrderStatus, pickupEvent: PublicOrderPickupEvent): boolean => {
  if (status === OrderStatus.CANCELLED || status === OrderStatus.FULFILLED) {
    // If the order is cancelled by the user or fulfilled, no further action can be taken.
    return false;
  }
  // If there's less than two days before the pickup event, merch distributors are already
  // preparing the order. Thus, the order can't be rescheduled/cancelled at this time.
  const now = new Date();
  const eventStart = new Date(pickupEvent.start);
  eventStart.setDate(eventStart.getDate() - 2);
  if (now > eventStart) {
    return false;
  }
  return true;
};

const OrderSummary = ({
  order,
  orderStatus,
  futurePickupEvents,
  pickupEvent,
  reschedulePickupEvent,
  cancelOrder,
}: OrderSummaryProps) => {
  const items = getOrderItemQuantities(order.items);

  const totalCostWithoutDiscount = items.reduce((cost, item) => {
    return cost + item.quantity * item.option.price;
  }, 0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const actionable = isOrderActionable(orderStatus, pickupEvent);

  return (
    <div className={styles.container}>
      <PickupEventPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        pickupEvent={pickupEvent}
        reschedulePickupEvent={reschedulePickupEvent}
        futurePickupEvents={futurePickupEvents}
        reschedulable={actionable}
      />
      <CancelPickupModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        cancelOrder={cancelOrder}
      />
      {items.map(item => (
        <Link
          href={`${config.store.itemRoute}${item.option.item.uuid}`}
          key={item.uuid}
          className={styles.itemInfo}
        >
          <div className={styles.image}>
            <Image
              src={getDefaultOrderItemPhoto(item)}
              style={{ objectFit: 'cover' }}
              sizes="9.375rem"
              alt="Store item picture"
              fill
            />
          </div>
          <div className={styles.itemSummary}>
            <Typography variant="h4/bold">{item.option.item.itemName}</Typography>
            <div className={styles.label}>
              <Typography variant="h5/bold">Price: </Typography>
              <Diamonds
                count={item.option.price * item.quantity}
                discount={item.salePriceAtPurchase}
              />
            </div>
            <div className={styles.label}>
              <Typography variant="h5/bold">Quantity: </Typography>
              <Typography variant="h5/regular">{item.quantity}</Typography>
            </div>
            {item.option.metadata ? (
              <div className={styles.label}>
                <Typography variant="h5/bold">{`${capitalize(
                  item.option.metadata.type
                )}: `}</Typography>
                <Typography variant="h5/regular">{item.option.metadata.value}</Typography>
              </div>
            ) : null}
          </div>
        </Link>
      ))}
      <hr className={styles.divider} />
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <Button onClick={() => setModalOpen(true)}>Pickup Details</Button>
          {actionable ? (
            <>
              <Button onClick={() => setModalOpen(true)}>Reschedule Pickup</Button>
              <Button onClick={() => setCancelModalOpen(true)} destructive>
                Cancel Order
              </Button>
            </>
          ) : null}
        </div>
        <div className={styles.totalPrice}>
          <Typography variant="h4/bold">Total: </Typography>
          <Diamonds
            count={totalCostWithoutDiscount}
            discount={order.totalCost}
            className={styles.totalDiamonds}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
