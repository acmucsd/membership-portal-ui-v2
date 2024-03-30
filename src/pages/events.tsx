import { Dropdown, PaginationControls, Typography } from '@/components/common';
import { DIVIDER } from '@/components/common/Dropdown';
import { EventDisplay } from '@/components/events';
import { config } from '@/lib';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import useQueryState from '@/lib/hooks/useQueryState';
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
  search: string;
  communityFilter: string;
  timeFilter: string | number;
  attendanceFilter: string;
}

const filterEvent = (
  event: PublicEvent,
  attendances: PublicAttendance[],
  { search, communityFilter, timeFilter, attendanceFilter }: FilterOptions
): boolean => {
  // Filter search query
  if (search !== '' && !formatSearch(event.title).includes(formatSearch(search))) {
    return false;
  }
  // Filter by community
  if (communityFilter !== 'all' && event.committee.toLowerCase() !== communityFilter) {
    return false;
  }
  // Filter by date
  const { from, to } = getDateRange(timeFilter);
  if (from !== undefined && new Date(event.start) < new Date(from * 1000)) {
    return false;
  }
  if (to !== undefined && new Date(event.end) > new Date(to * 1000)) {
    return false;
  }
  // Filter by attendance
  if (attendanceFilter === 'all') {
    return true;
  }
  const attended = attendances.some(a => a.event.uuid === event.uuid);
  if (attendanceFilter === 'attended' && !attended) {
    return false;
  }
  if (attendanceFilter === 'not-attended' && attended) {
    return false;
  }
  return true;
};

const CommunityOptions = [
  { value: 'all', label: 'All communities' },
  { value: 'general', label: 'General' },
  { value: 'ai', label: 'AI' },
  { value: 'cyber', label: 'Cyber' },
  { value: 'design', label: 'Design' },
  { value: 'hack', label: 'Hack' },
];

const TimeOptions = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past-week', label: 'Past week' },
  { value: 'past-month', label: 'Past month' },
  { value: 'past-year', label: 'Past year' },
  { value: 'all-time', label: 'All time' },
];

const AttendanceOptions = [
  { value: 'all', label: 'Any attendance' },
  { value: 'attended', label: 'Attended' },
  { value: 'not-attended', label: 'Not attended' },
];

const ROWS_PER_PAGE = 25;
const EventsPage = ({ events, attendances }: EventsPageProps) => {
  const [page, setPage] = useState(0);
  const years = useMemo(getYears, []);

  const validCommunity = (value: string): boolean => {
    return CommunityOptions.some(o => o.value === value);
  };

  const validTime = (value: string): boolean => {
    return TimeOptions.some(o => o.value === value) || years.some(o => o.value === value);
  };

  const validAttendance = (value: string): boolean => {
    return AttendanceOptions.some(o => o.value === value);
  };

  const validSearch = (): boolean => {
    // Any string is a valid search, so just return true.
    return true;
  };

  const [states, setStates] = useQueryState({
    pathName: config.eventsRoute,
    queryStates: {
      community: {
        defaultValue: 'all',
        valid: validCommunity,
      },
      time: {
        defaultValue: 'all-time',
        valid: validTime,
      },
      attendance: {
        defaultValue: 'all',
        valid: validAttendance,
      },
      search: {
        defaultValue: '',
        valid: validSearch,
      },
    },
  });

  const communityFilter = states.community?.value || 'all';
  const timeFilter = states.time?.value || 'all-time';
  const attendanceFilter = states.attendance?.value || 'all';
  const search = states.search?.value || '';

  const filteredEvents = events.filter(e =>
    filterEvent(e, attendances, { search, communityFilter, timeFilter, attendanceFilter })
  );

  filteredEvents.sort((a, b) => {
    if (timeFilter === 'upcoming') {
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
          value={search}
          onChange={e => {
            setStates('search', e.currentTarget.value);
            setPage(0);
          }}
        />
        <div className={styles.filterOption}>
          <Dropdown
            name="communityOptions"
            ariaLabel="Filter events by community"
            options={CommunityOptions}
            value={communityFilter}
            onChange={v => {
              setStates('community', v);
              setPage(0);
            }}
          />
        </div>

        <div className={styles.filterOption}>
          <Dropdown
            name="timeOptions"
            ariaLabel="Filter events by time"
            options={[...TimeOptions, DIVIDER, ...years]}
            value={timeFilter}
            onChange={v => {
              setStates('time', v);
              setPage(0);
            }}
          />
        </div>

        <div className={styles.filterOption}>
          <Dropdown
            name="timeOptions"
            ariaLabel="Filter events by attendance"
            options={AttendanceOptions}
            value={attendanceFilter}
            onChange={v => {
              setStates('attendance', v);
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
