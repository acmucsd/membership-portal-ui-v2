import { Dropdown, PaginationControls, Typography } from '@/components/common';
import EventDisplay from '@/components/events/EventDisplay';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDateRange, getYears } from '@/lib/utils';
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
  if (query !== '' && !event.title.toLowerCase().includes(query)) {
    return false;
  }
  if (communityFilter !== 'all' && event.committee.toLowerCase() !== communityFilter) {
    return false;
  }
  const { from, to } = getDateRange(dateFilter);
  if (from !== undefined && new Date(event.start) < new Date(from * 1000)) {
    return false;
  }
  if (to !== undefined && new Date(event.end) > new Date(to * 1000)) {
    return false;
  }

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

  const years = useMemo(() => getYears(), []);

  const filteredEvents = events.filter(e =>
    filterEvent(e, attendances, { query, communityFilter, dateFilter, attendedFilter })
  );
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
              '---',
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
  const events = await EventAPI.getAllEvents();
  const attendances = await EventAPI.getAttendancesForUser(authToken);

  const now = new Date();
  const pastEvents: PublicEvent[] = [];
  const upcomingEvents: PublicEvent[] = [];
  const liveEvents: PublicEvent[] = [];

  events.forEach(e => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    if (end < now) {
      pastEvents.push(e);
    } else if (start > now) {
      upcomingEvents.push(e);
    } else {
      liveEvents.push(e);
    }
  });

  return { props: { events, attendances } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
