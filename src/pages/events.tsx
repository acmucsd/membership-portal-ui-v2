import { Dropdown, PaginationControls, Typography } from '@/components/common';
import { DIVIDER } from '@/components/common/Dropdown';
import { EventDisplay } from '@/components/events';
import { config } from '@/lib';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { FilterEventOptions } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import { formatSearch, getDateRange, getYears } from '@/lib/utils';
import styles from '@/styles/pages/events.module.scss';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

interface EventsPageProps {
  events: PublicEvent[];
  attendances: PublicAttendance[];
  initialFilters: FilterEventOptions;
}

interface FilterOptions {
  query: string;
  communityFilter: string;
  dateFilter: string | number;
  attendedFilter: string;
}

const DEFAULT_FILTER_STATE = {
  community: 'all',
  date: 'all',
  attended: 'any',
};

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
  if (
    communityFilter !== DEFAULT_FILTER_STATE.community &&
    event.committee.toLowerCase() !== communityFilter
  ) {
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
  if (attendedFilter === DEFAULT_FILTER_STATE.attended) {
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
const EventsPage = ({ events, attendances, initialFilters }: EventsPageProps) => {
  const [page, setPage] = useState(0);
  const [communityFilter, setCommunityFilter] = useState<string>(initialFilters.community);
  const [dateFilter, setDateFilter] = useState<string>(initialFilters.date);
  const [attendedFilter, setAttendedFilter] = useState<string>(initialFilters.attended);
  const [query, setQuery] = useState('');

  const router = useRouter();

  useEffect(() => {
    const urlSynced =
      router.query.attended === attendedFilter &&
      router.query.date === dateFilter &&
      router.query.community === communityFilter;

    if (!urlSynced) {
      if (Object.keys(router.query).length === 0) {
        // If url is /events, we can set to default instead of looking for query parameters
        setCommunityFilter(DEFAULT_FILTER_STATE.community);
        setDateFilter(DEFAULT_FILTER_STATE.date);
        setAttendedFilter(DEFAULT_FILTER_STATE.attended);
        return;
      }

      // If the URL state has directly changed, we should update the client filter state to match
      setAttendedFilter(router.query.attended as string);
      setDateFilter(router.query.date as string);
      setCommunityFilter(router.query.community as string);
    }

    // If we add the filter state as a depeandency here, changing the URL params will enter an infinite callback loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    const urlSynced =
      router.query.attended === attendedFilter &&
      router.query.date === dateFilter &&
      router.query.community === communityFilter;

    if (!urlSynced) {
      if (
        attendedFilter === DEFAULT_FILTER_STATE.attended &&
        dateFilter === DEFAULT_FILTER_STATE.date &&
        communityFilter === DEFAULT_FILTER_STATE.community
      )
        // We can leave the URL alone in the default state of /events
        return;

      // If the client state of the filters has changed, we should update the URL to match
      router.replace(
        `${config.eventsRoute}?${new URLSearchParams({
          attended: attendedFilter,
          community: communityFilter,
          date: dateFilter,
        })}`
      );
    }
    // If we add the router as a depeandency here, changing the URL params will enter an infinite callback loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, attendedFilter, communityFilter]);

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
              { value: 'past-week', label: 'Past Week' },
              { value: 'past-month', label: 'Past Month' },
              { value: 'past-year', label: 'Past Year' },
              { value: 'all-time', label: 'All Time' },
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
              { value: 'any', label: 'Any Attendance' },
              { value: 'attended', label: 'Attended' },
              { value: 'not-attended', label: 'Not Attended' },
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

      {filteredEvents.length > 0 ? (
        <PaginationControls
          page={page}
          onPage={page => setPage(page)}
          pages={Math.ceil(filteredEvents.length / ROWS_PER_PAGE)}
        />
      ) : null}
    </div>
  );
};

export default EventsPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const getEventsPromise = EventAPI.getAllEvents();
  const getAttendancesPromise = UserAPI.getAttendancesForCurrentUser(authToken);

  const [events, attendances] = await Promise.all([getEventsPromise, getAttendancesPromise]);

  const {
    community = DEFAULT_FILTER_STATE.community,
    date = DEFAULT_FILTER_STATE.date,
    attended = DEFAULT_FILTER_STATE.attended,
  } = query as FilterEventOptions;

  const initialFilters = { community, date, attended };

  return { props: { events, attendances, initialFilters } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
