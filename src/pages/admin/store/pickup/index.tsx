import { PickupEventCard } from '@/components/admin/store';
import { Typography } from '@/components/common';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/StorePickupEventPage.module.scss';
import router from 'next/router';
import { useState } from 'react';

interface AdminPickupPageProps {
  futurePickupEvents: PublicOrderPickupEvent[];
  pastPickupEvents: PublicOrderPickupEvent[];
}

const AdminPickupPage = ({ futurePickupEvents, pastPickupEvents }: AdminPickupPageProps) => {
  const [display, setDisplay] = useState<'past' | 'future'>('future');
  const displayPickupEvents = display === 'past' ? pastPickupEvents : futurePickupEvents;
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1/bold" style={{ marginRight: 'auto' }}>
          Manage Pickup Events
        </Typography>
        <div className={styles.displayButtons}>
          <button
            type="button"
            className={`${styles.displayButton} ${styles.active}`}
            onClick={() => router.push(`${config.admin.store.pickupCreate}`)}
          >
            <Typography variant="h5/bold">Create New Pickup Event</Typography>
          </button>
        </div>

        <div className={styles.displayButtons}>
          <button
            type="button"
            className={`${styles.displayButton} ${display === 'future' && styles.active}`}
            onClick={() => setDisplay('future')}
          >
            <Typography variant="h5/bold">Future</Typography>
          </button>
          <button
            type="button"
            className={`${styles.displayButton} ${display === 'past' && styles.active}`}
            onClick={() => setDisplay('past')}
          >
            <Typography variant="h5/bold">Past</Typography>
          </button>
        </div>
      </div>
      <div className={styles.cardContainer}>
        {displayPickupEvents
          .sort((x, y) => {
            return Date.parse(x.start) - Date.parse(y.start);
          })
          .map(pickupEvent => (
            <PickupEventCard pickupEvent={pickupEvent} key={pickupEvent.uuid} />
          ))}
      </div>
    </div>
  );
};

export default AdminPickupPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ authToken: token }) => {
  const futurePickupEventsPromise = StoreAPI.getFutureOrderPickupEvents(token);
  const pastPickupEventsPromise = StoreAPI.getPastOrderPickupEvents(token);
  const [futurePickupEvents, pastPickupEvents] = await Promise.all([
    futurePickupEventsPromise,
    pastPickupEventsPromise,
  ]);
  return { props: { title: 'Manage Pickup Events', futurePickupEvents, pastPickupEvents, token } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManagePickupEvents,
  { redirectTo: config.homeRoute }
);
