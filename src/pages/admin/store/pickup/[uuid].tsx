import { PickupOrdersDisplay } from '@/components/admin/store';
import { PickupEventStatus } from '@/components/admin/store/PickupEventCard';
import { Typography } from '@/components/common';
import { EventCard } from '@/components/events';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { formatEventDate } from '@/lib/utils';
import styles from '@/styles/pages/StorePickupEventDetailsPage.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

interface PickupEventDetailsPageProps {
  pickupEvent: PublicOrderPickupEvent;
}

const PickupEventDetailsPage = ({ pickupEvent }: PickupEventDetailsPageProps) => {
  const { status, title, start, end, orderLimit, description, linkedEvent, orders } = pickupEvent;
  const [ordersView, setOrdersView] = useState<'fulfill' | 'prepare'>('fulfill');

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
            <Typography variant="h4/regular" suppressHydrationWarning>
              {formatEventDate(start, end, true)}
            </Typography>
            <Typography variant="h4/regular">{`Max Orders: ${orderLimit}`}</Typography>
            <Typography variant="h4/regular">{description}</Typography>
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
          {orders && orders.length > 0 ? (
            <PickupOrdersDisplay mode={ordersView} orders={orders} />
          ) : (
            'No orders placed.'
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupEventDetailsPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  try {
    const pickupEvent = await StoreAPI.getPickupEvent(token, uuid);
    if (pickupEvent.orders)
      pickupEvent.orders.sort((a, b) => {
        const aName = a.user.lastName + a.user.firstName;
        const bName = b.user.lastName + b.user.firstName;
        return aName.localeCompare(bName);
      });
    return {
      props: {
        pickupEvent,
      },
    };
  } catch (e) {
    return { notFound: true };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManagePickupEvents
);
