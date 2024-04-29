import {
  cancelPickupEvent,
  completePickupEvent,
} from '@/components/admin/event/AdminPickupEvent/AdminPickupEventForm';
import {
  PickupEventStatus,
  PickupOrdersFulfillDisplay,
  PickupOrdersPrepareDisplay,
} from '@/components/admin/store';
import { Button, Typography } from '@/components/common';
import { EventCard } from '@/components/events';
import { StoreAPI } from '@/lib/api';
import config from '@/lib/config';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { OrderPickupEventStatus } from '@/lib/types/enums';
import { formatEventDate } from '@/lib/utils';
import styles from '@/styles/pages/StorePickupEventDetailsPage.module.scss';
import Link from 'next/link';
import router from 'next/router';
import { useState } from 'react';

interface PickupEventDetailsPageProps {
  pickupEvent: PublicOrderPickupEvent;
  token: string;
}

const PickupEventDetailsPage = ({ pickupEvent, token }: PickupEventDetailsPageProps) => {
  const {
    uuid,
    status,
    title,
    start,
    end,
    orderLimit,
    description,
    linkedEvent,
    orders: initOrders,
  } = pickupEvent;
  const [orders, setOrders] = useState(initOrders);
  const [ordersView, setOrdersView] = useState<'fulfill' | 'prepare'>('fulfill');

  let ordersComponent;
  if (orders && orders.length > 0)
    ordersComponent =
      ordersView === 'fulfill' ? (
        <PickupOrdersFulfillDisplay orders={orders} onOrderUpdate={setOrders} token={token} />
      ) : (
        <PickupOrdersPrepareDisplay orders={orders} />
      );

  return (
    <div className={styles.page}>
      <Link href={config.admin.store.pickup} className={styles.back}>
        {'< Back to dashboard'}
      </Link>
      <div className={styles.container}>
        <div className={styles.pickupDetails}>
          {linkedEvent ? (
            <EventCard event={linkedEvent} attended={false} hideInfo />
          ) : (
            <Typography variant="h3/regular" className={styles.noEvent}>
              *Not linked to an event on the membership portal
            </Typography>
          )}
          <div>
            <PickupEventStatus status={status} variant="h3/bold" />
            <Typography variant="h1/bold">{title}</Typography>
            <Button
              className={`${styles.displayButton}`}
              onClick={() => router.push(`${config.admin.store.pickupEdit}/${uuid}`)}
            >
              <Typography variant="h5/bold">Edit Pickup Event</Typography>
            </Button>
            {status === OrderPickupEventStatus.ACTIVE ? (
              <Button
                className={`${styles.displayButton}`}
                onClick={() => completePickupEvent(uuid, token)}
              >
                <Typography variant="h5/bold">Complete Pickup Event</Typography>
              </Button>
            ) : null}
            {status === OrderPickupEventStatus.ACTIVE ? (
              <Button
                className={`${styles.displayButton}`}
                onClick={() => {
                  cancelPickupEvent(uuid, token);
                }}
                destructive
              >
                <Typography variant="h5/bold">Cancel Pickup Event</Typography>
              </Button>
            ) : null}
            <Typography variant="h4/regular" suppressHydrationWarning>
              {formatEventDate(start, end, true)}
            </Typography>
            <Typography variant="h4/regular">{`Max Orders: ${orderLimit}`}</Typography>
            <Typography variant="h4/regular" className={styles.description}>
              {description}
            </Typography>
          </div>
        </div>
        <div className={styles.orders}>
          <div className={styles.header}>
            <Typography variant="h1/bold">Orders</Typography>
            <div className={styles.displayButtons}>
              <button
                type="button"
                className={`${styles.displayButton} ${ordersView === 'fulfill' && styles.active}`}
                onClick={() => setOrdersView('fulfill')}
              >
                <Typography variant="h5/bold">Fulfill</Typography>
              </button>
              <button
                type="button"
                className={`${styles.displayButton} ${ordersView === 'prepare' && styles.active}`}
                onClick={() => setOrdersView('prepare')}
              >
                <Typography variant="h5/bold">Prepare</Typography>
              </button>
            </div>
          </div>
          {ordersComponent || 'No orders placed.'}
        </div>
      </div>
    </div>
  );
};

export default PickupEventDetailsPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ params, authToken: token }) => {
  const uuid = params?.uuid as string;
  try {
    const pickupEvent = await StoreAPI.getPickupEvent(token, uuid);
    if (pickupEvent.orders)
      pickupEvent.orders.sort((a, b) => {
        const aName = a.user.lastName + a.user.firstName;
        const bName = b.user.lastName + b.user.firstName;
        return aName.localeCompare(bName);
      });
    return {
      props: { title: pickupEvent.title, pickupEvent, token },
    };
  } catch (e) {
    return { notFound: true };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManagePickupEvents
);
