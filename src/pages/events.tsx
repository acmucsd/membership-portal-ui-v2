import { Dropdown, PaginationControls, Typography } from '@/components/common';
import { DIVIDER } from '@/components/common/Dropdown';
import { EventDisplay } from '@/components/events';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { formatSearch, getDateRange, getYears } from '@/lib/utils';
import styles from '@/styles/pages/events.module.scss';
import type { GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';

interface EventsPageProps {
  events: PublicEvent[];
  attendances: PublicAttendance[];
}

interface FilterOptions {
  query: string;
  communityFilter: string;
  dateFilter: string | number;
  attendedFilter: string;
}

const filterEvent = (
  event: PublicEvent,
  attendances: PublicAttendance[],
  { query, communityFilter, dateFilter, attendedFilter }: FilterOptions
): boolean => {
  // Filter search query
  if (query !== '' && !formatSearch(event.title).includes(formatSearch(query))) {
    return false;
  }
  // Filter by community
  if (communityFilter !== 'all' && event.committee.toLowerCase() !== communityFilter) {
    return false;
  }
  // Filter by date
  const { from, to } = getDateRange(dateFilter);
  if (from !== undefined && new Date(event.start) < new Date(from * 1000)) {
    return false;
  }
  if (to !== undefined && new Date(event.end) > new Date(to * 1000)) {
    return false;
  }
  // Filter by attendance
  if (attendedFilter === 'all') {
    return true;
  }
  const attended = attendances.some(a => a.event.uuid === event.uuid);
  if (attendedFilter === 'attended' && !attended) {
    return false;
  }
  if (attendedFilter === 'not-attended' && attended) {
    return false;
  }
  return true;
};

const ROWS_PER_PAGE = 25;
const EventsPage = ({ events, attendances }: EventsPageProps) => {
  const [page, setPage] = useState(0);
  const [communityFilter, setCommunityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [attendedFilter, setAttendedFilter] = useState('all');
  const [query, setQuery] = useState('');

  const years = useMemo(getYears, []);

  const filteredEvents = events.filter(e =>
    filterEvent(e, attendances, { query, communityFilter, dateFilter, attendedFilter })
  );

  filteredEvents.sort((a, b) => {
    if (dateFilter === 'upcoming') {
      // For upcoming events, sort from soonest to latest
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    }
    // For all other events, sort from most recent to least recent
    return new Date(b.start).getTime() - new Date(a.start).getTime();
  });

  const displayedEvents = filteredEvents.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div className={styles.page}>
      <Typography variant="headline/heavy/small">Events</Typography>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search Events"
          aria-label="Search Events"
          value={query}
          onChange={e => {
            setQuery(e.currentTarget.value);
            setPage(0);
          }}
        />
        <div className={styles.filterOption}>
          <Dropdown
            name="communityOptions"
            ariaLabel="Filter events by community"
            options={[
              { value: 'all', label: 'All communities' },
              { value: 'general', label: 'General' },
              { value: 'ai', label: 'AI' },
              { value: 'cyber', label: 'Cyber' },
              { value: 'design', label: 'Design' },
              { value: 'hack', label: 'Hack' },
            ]}
            value={communityFilter}
            onChange={v => {
              setCommunityFilter(v);
              setPage(0);
            }}
          />
        </div>

        <div className={styles.filterOption}>
          <Dropdown
            name="timeOptions"
            ariaLabel="Filter events by time"
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past-week', label: 'Past week' },
              { value: 'past-month', label: 'Past month' },
              { value: 'past-year', label: 'Past year' },
              { value: 'all-time', label: 'All time' },
              DIVIDER,
              ...years,
            ]}
            value={dateFilter}
            onChange={v => {
              setDateFilter(v);
              setPage(0);
            }}
          />
        </div>

        <div className={styles.filterOption}>
          <Dropdown
            name="timeOptions"
            ariaLabel="Filter events by attendance"
            options={[
              { value: 'all', label: 'Any attendance' },
              { value: 'attended', label: 'Attended' },
              { value: 'not-attended', label: 'Not attended' },
            ]}
            value={attendedFilter}
            onChange={v => {
              setAttendedFilter(v);
              setPage(0);
            }}
          />
        </div>
      </div>
      <EventDisplay events={displayedEvents} attendances={attendances} />

      {filteredEvents.length > 0 && (
        <PaginationControls
          page={page}
          onPage={page => setPage(page)}
          pages={Math.ceil(filteredEvents.length / ROWS_PER_PAGE)}
        />
      )}
    </div>
  );
};

export default EventsPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const getEventsPromise = EventAPI.getAllEvents();
  const getAttendancesPromise = UserAPI.getAttendancesForCurrentUser(authToken);

  const [events, attendances] = await Promise.all([getEventsPromise, getAttendancesPromise]);

  return { props: { events, attendances } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
