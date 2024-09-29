import { LoginAppeal, PaginationControls, Typography } from '@/components/common';
import EventDisplay from '@/components/events/EventDisplay';
import EventFilter, { DEFAULT_FILTER_STATE } from '@/components/events/EventFilter';
import { config } from '@/lib';
import useQueryState from '@/lib/hooks/useQueryState';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import {
  FilterEventOptions,
  isValidAttendanceFilter,
  isValidCommunityFilter,
  isValidDateFilter,
} from '@/lib/types/client';
import { formatSearch, getDateRange, getYears } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface EventListProps {
  events: PublicEvent[];
  attendances: PublicAttendance[];
  initialFilters: FilterEventOptions;
  loggedOut: boolean;
}

interface FilterOptions {
  search: string;
  communityFilter: string;
  dateFilter: string | number;
  attendanceFilter: string;
}

const filterEvent = (
  event: PublicEvent,
  attendances: PublicAttendance[],
  { search, communityFilter, dateFilter, attendanceFilter }: FilterOptions
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
  const { from, to } = getDateRange(dateFilter);
  if (from !== undefined && new Date(event.start) < new Date(from * 1000)) {
    return false;
  }
  if (to !== undefined && new Date(event.end) > new Date(to * 1000)) {
    return false;
  }
  // Filter by attendance
  if (attendanceFilter === 'any') {
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

const ROWS_PER_PAGE = 25;

const EventList = ({ events, attendances, initialFilters, loggedOut }: EventListProps) => {
  const [page, setPage] = useState(0);
  const years = useMemo(getYears, []);

  const validDate = (value: string): boolean => {
    return isValidDateFilter(value) || years.some(o => o.value === value);
  };

  const [states, setStates] = useQueryState({
    pathName: config.eventsRoute,
    initialFilters,
    queryStates: {
      community: {
        defaultValue: DEFAULT_FILTER_STATE.community,
        valid: isValidCommunityFilter,
      },
      date: {
        defaultValue: DEFAULT_FILTER_STATE.date,
        valid: validDate,
      },
      attendance: {
        defaultValue: DEFAULT_FILTER_STATE.attendance,
        valid: isValidAttendanceFilter,
      },
      search: {
        defaultValue: DEFAULT_FILTER_STATE.search,
        // Any string is a valid search, so just return true.
        valid: () => true,
      },
    },
  });

  const communityFilter = states.community?.value || DEFAULT_FILTER_STATE.community;
  const dateFilter = states.date?.value || DEFAULT_FILTER_STATE.date;
  const attendanceFilter = states.attendance?.value || DEFAULT_FILTER_STATE.attendance;
  const search = states.search?.value || DEFAULT_FILTER_STATE.search;

  const filteredEvents = events.filter(e =>
    filterEvent(e, attendances, { search, communityFilter, dateFilter, attendanceFilter })
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
    <>
      <Typography variant="headline/heavy/small">Events</Typography>
      {loggedOut ? (
        <LoginAppeal>
          Create an account to check into events, give feedback, earn points, and join a community
          of thousands.
        </LoginAppeal>
      ) : null}
      <EventFilter
        filters={{ search, communityFilter, dateFilter, attendanceFilter }}
        onFilter={(param, value) => {
          setStates(param, value);
          setPage(0);
        }}
        loggedOut={loggedOut}
      />
      <EventDisplay events={displayedEvents} attendances={attendances} />

      {filteredEvents.length > 0 ? (
        <PaginationControls
          page={page}
          onPage={page => setPage(page)}
          pages={Math.ceil(filteredEvents.length / ROWS_PER_PAGE)}
        />
      ) : null}
    </>
  );
};

export default EventList;
