import { Button, Typography } from '@/components/common';
import CancelPickupModal from '@/components/store/CancelPickupModal';
import Diamonds from '@/components/store/Diamonds';
import PickupEventPreviewModal from '@/components/store/PickupEventPreviewModal';
import { config } from '@/lib';
import { PublicOrderPickupEvent, PublicOrderWithItems } from '@/lib/types/apiResponses';
import { OrderStatus } from '@/lib/types/enums';
import {
  OrderItemQuantity,
  capitalize,
  getDefaultOrderItemPhoto,
  getOrderItemQuantities,
} from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './style.module.scss';

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
  if (status === OrderStatus.PLACED && now > eventStart) {
    return false;
  }
  return true;
};

interface OrderItemPreviewProps {
  item: OrderItemQuantity;
  showFulfilled: boolean;
  showNotFulfilled: boolean;
}

const OrderItemPreview = ({ item, showFulfilled, showNotFulfilled }: OrderItemPreviewProps) => {
  return (
    <Link href={`${config.store.itemRoute}${item.option.item.uuid}`} className={styles.itemInfo}>
      <div className={styles.image}>
        <Image
          src={getDefaultOrderItemPhoto(item)}
          style={{ objectFit: 'cover' }}
          sizes="9.375rem"
          alt="Store item picture"
          fill
        />
        {showFulfilled && item.fulfilled ? (
          // "Already picked up" means that the item could only have been picked
          // up from a previous partially fulfilled order that was rescheduled.
          // For example, if an item is fulfilled but the order is missed or
          // cancelled
          <div className={`${styles.badge} ${styles.pickedUp}`}>
            {showNotFulfilled ? 'Picked up' : 'Already picked up'}
          </div>
        ) : null}
        {showNotFulfilled && !item.fulfilled ? (
          // Only shows for partially fulfilled orders when the item wasn't
          // available at the pickup event (e.g. hoodies haven't arrived yet)
          <div className={`${styles.badge} ${styles.notAvailable}`}>Not picked up</div>
        ) : null}
      </div>
      <div className={styles.itemSummary}>
        <Typography variant="h4/bold">{item.option.item.itemName}</Typography>
        <div className={styles.label}>
          <Typography variant="h5/bold">Price: </Typography>
          <Diamonds count={item.option.price * item.quantity} discount={item.salePriceAtPurchase} />
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
  );
};

interface OrderSummaryProps {
  order: PublicOrderWithItems;
  orderStatus: OrderStatus;
  futurePickupEvents: PublicOrderPickupEvent[];
  pickupEvent: PublicOrderPickupEvent;
  reschedulePickupEvent: (pickup: PublicOrderPickupEvent) => Promise<void>;
  cancelOrder: () => Promise<void>;
}

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
        <OrderItemPreview
          item={item}
          // It doesn't make sense for a fulfilled event to have non-fulfilled
          // items, but if it does ever happen, it would be good to show it
          showNotFulfilled={
            orderStatus === OrderStatus.FULFILLED || orderStatus === OrderStatus.PARTIALLY_FULFILLED
          }
          // The only state when every item should be fulfilled is FULFILLED, so
          // we don't need to show whether an item is fulfilled
          showFulfilled={orderStatus !== OrderStatus.FULFILLED}
          key={item.uuids[0]}
        />
      ))}
      <hr className={styles.divider} />
      {actionable && items.some(item => !item.fulfilled) && orderStatus !== OrderStatus.PLACED ? (
        <p className={styles.rescheduleReminder}>
          {items.some(item => item.fulfilled)
            ? 'We apologize for not having your complete order ready. Please schedule a new pickup time for the rest of your order.'
            : 'Please schedule a new pickup time for your order.'}
        </p>
      ) : null}
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
