import {
  cancelPickupEvent,
  completePickupEvent,
} from '@/components/admin/event/AdminPickupEvent/AdminPickupEventForm';
import { PickupEventStatus, PickupOrdersPrepareDisplay } from '@/components/admin/store';
import { Button, Typography } from '@/components/common';
import { EventCard } from '@/components/events';
import { StoreAPI } from '@/lib/api';
import config from '@/lib/config';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import useConfirm from '@/lib/hooks/useConfirm';
import { PermissionService } from '@/lib/services';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { OrderPickupEventStatus } from '@/lib/types/enums';
import { formatEventDate } from '@/lib/utils';
import styles from '@/styles/pages/StorePickupEventDetailsPage.module.scss';
import Link from 'next/link';
import router from 'next/router';
import { useMemo, useState } from 'react';

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

  const started = useMemo(() => Date.now() >= new Date(start).getTime(), [start]);

  const confirmComplete = useConfirm({
    title: 'Confirm completion',
    question:
      'Are you sure you want to complete this pickup event? Pending orders will be marked as missed. This cannot be undone.',
    action: 'Complete',
  });
  const confirmCancel = useConfirm({
    title: 'Confirm cancellation',
    question: 'Are you sure you want to cancel this pickup event? This cannot be undone.',
    action: 'Cancel event',
    cancel: 'Back',
  });

  return (
    <div className={styles.page}>
      {confirmComplete.modal}
      {confirmCancel.modal}
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
            <div className={styles.buttonContainer}>
              <Button
                className={`${styles.displayButton}`}
                onClick={() => router.push(`${config.admin.store.pickupEdit}/${uuid}`)}
              >
                <Typography variant="h5/bold">Edit Pickup Event</Typography>
              </Button>
              {status === OrderPickupEventStatus.ACTIVE ? (
                <Button
                  className={`${styles.displayButton}`}
                  onClick={() => confirmComplete.confirm(() => completePickupEvent(uuid, token))}
                >
                  <Typography variant="h5/bold">Complete Pickup Event</Typography>
                </Button>
              ) : null}
              {status === OrderPickupEventStatus.ACTIVE ? (
                <Button
                  className={`${styles.displayButton}`}
                  onClick={() => confirmCancel.confirm(() => cancelPickupEvent(uuid, token))}
                  destructive
                >
                  <Typography variant="h5/bold">Cancel Pickup Event</Typography>
                </Button>
              ) : null}
            </div>
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
          {orders && orders.length > 0 ? (
            <PickupOrdersPrepareDisplay
              orders={orders}
              onOrderUpdate={setOrders}
              token={token}
              canFulfill={status === OrderPickupEventStatus.ACTIVE && started}
            />
          ) : (
            'No orders placed.'
          )}
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
