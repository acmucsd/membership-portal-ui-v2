import { DEFAULT_FILTER_STATE, EventList } from '@/components/events';
import { EventAPI, UserAPI } from '@/lib/api';
import { getCurrentUser } from '@/lib/hoc/withAccessType';
import { CookieService } from '@/lib/services';
import type { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { FilterEventOptions } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/events.module.scss';
import { GetServerSideProps } from 'next';

interface EventsPageProps {
  events: PublicEvent[];
  attendances: PublicAttendance[];
  initialFilters: FilterEventOptions;
  loggedOut: boolean;
}

const EventsPage = ({ events, attendances, initialFilters, loggedOut }: EventsPageProps) => {
  return (
    <div className={styles.page}>
      <EventList
        events={events}
        attendances={attendances}
        initialFilters={initialFilters}
        loggedOut={loggedOut}
      />
    </div>
  );
};

export default EventsPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const authToken: string | null =
    CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res }) ?? null;
  const user = authToken !== null ? await getCurrentUser({ req, res }, authToken) : null;

  const getEventsPromise = EventAPI.getAllEvents();
  const getAttendancesPromise = authToken ? UserAPI.getAttendancesForCurrentUser(authToken) : [];

  const [events, attendances] = await Promise.all([getEventsPromise, getAttendancesPromise]);

  const {
    community = DEFAULT_FILTER_STATE.community,
    date = DEFAULT_FILTER_STATE.date,
    attendance = DEFAULT_FILTER_STATE.attendance,
    search = DEFAULT_FILTER_STATE.search,
  } = query as FilterEventOptions;

  const initialFilters = { community, date, attendance, search };

  return {
    props: {
      title: 'Events',
      events,
      attendances,
      initialFilters,
      loggedOut: authToken === null,
      // For navbar
      user,
    },
  };
};
