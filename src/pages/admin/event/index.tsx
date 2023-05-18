import ManageEventCard from '@/components/admin/event/ManageEventCard';
import { Button } from '@/components/common';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import style from '@/styles/pages/manage-events.module.scss';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface IProps {
  allEvents: PublicEvent[];
  pastEvents: PublicEvent[];
  futureEvents: PublicEvent[];
}

const ManageAllEventsPage: NextPage<IProps> = (props: IProps) => {
  const { allEvents, pastEvents, futureEvents } = props;

  const [mode, setMode] = useState<'all' | 'past' | 'future'>('future');

  const visibleEvents = useMemo(() => {
    switch (mode) {
      case 'all':
        return allEvents;
      case 'past':
        return pastEvents;
      case 'future':
        return futureEvents;
      default:
        return futureEvents;
    }
  }, [allEvents, futureEvents, mode, pastEvents]);

  return (
    <div className={style.container}>
      <h1>Manage Events</h1>
      <div className={style.header}>
        <div className={style.buttons}>
          <Button
            onClick={() => setMode('past')}
            size="small"
            variant={mode === 'past' ? 'primary' : 'secondary'}
          >
            Past Events
          </Button>
          <Button
            onClick={() => setMode('future')}
            size="small"
            variant={mode === 'future' ? 'primary' : 'secondary'}
          >
            Future Events
          </Button>
          <Button
            onClick={() => setMode('all')}
            size="small"
            variant={mode === 'all' ? 'primary' : 'secondary'}
          >
            All Events
          </Button>
        </div>

        <Link href="/admin/event/create">Create New Event</Link>
      </div>
      <div className={style.eventContainer}>
        {visibleEvents.map(event => (
          <ManageEventCard event={event} key={event.uuid} />
        ))}
      </div>
    </div>
  );
};

export default ManageAllEventsPage;

const getServerSidePropsFunc: GetServerSideProps = async () => {
  const allEventsFetch = EventAPI.getAllEvents();
  const pastEventsFetch = EventAPI.getAllPastEvents();
  const futureEventsFetch = EventAPI.getAllFutureEvents();

  const [allEvents, pastEvents, futureEvents] = await Promise.all([
    allEventsFetch,
    pastEventsFetch,
    futureEventsFetch,
  ]);

  return {
    props: { allEvents, pastEvents, futureEvents },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents(),
  config.admin
);
