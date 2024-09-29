import { Dropdown } from '@/components/common';
import { DIVIDER } from '@/components/common/Dropdown';
import { FilterEventOptions } from '@/lib/types/client';
import { getYears } from '@/lib/utils';
import { useMemo } from 'react';
import styles from './style.module.scss';

export interface FilterOptions {
  search: string;
  communityFilter: string;
  dateFilter: string;
  attendanceFilter: string;
}

interface EventFilterProps {
  filters: FilterOptions;
  onFilter?: (param: string, value: string) => void;
  loggedOut?: boolean;
}

export const DEFAULT_FILTER_STATE: FilterEventOptions = {
  community: 'all',
  date: 'all-time',
  attendance: 'any',
  search: '',
};

const EventFilter = ({
  filters: { search, communityFilter, dateFilter, attendanceFilter },
  onFilter,
  loggedOut,
}: EventFilterProps) => {
  const years = useMemo(getYears, []);

  return (
    <div className={styles.controls}>
      <input
        className={styles.search}
        type="search"
        placeholder="Search Events"
        aria-label="Search Events"
        value={search}
        onChange={e => {
          onFilter?.('search', e.currentTarget.value);
        }}
        readOnly={!onFilter}
      />
      <div className={styles.filterOption}>
        <Dropdown
          name="communityOptions"
          ariaLabel="Filter events by community"
          options={[
            { value: 'all', label: 'All Communities' },
            { value: 'general', label: 'General' },
            { value: 'ai', label: 'AI' },
            { value: 'cyber', label: 'Cyber' },
            { value: 'design', label: 'Design' },
            { value: 'hack', label: 'Hack' },
          ]}
          value={communityFilter}
          onChange={v => {
            onFilter?.('community', v);
          }}
          readOnly={!onFilter}
        />
      </div>

      <div className={styles.filterOption}>
        <Dropdown
          name="dateOptions"
          ariaLabel="Filter events by date"
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
            onFilter?.('date', v);
          }}
          readOnly={!onFilter}
        />
      </div>

      {loggedOut ? null : (
        <div className={styles.filterOption}>
          <Dropdown
            name="attendanceOptions"
            ariaLabel="Filter events by attendance"
            options={[
              { value: 'any', label: 'Any Attendance' },
              { value: 'attended', label: 'Attended' },
              { value: 'not-attended', label: 'Not Attended' },
            ]}
            value={attendanceFilter}
            onChange={v => {
              onFilter?.('attendance', v);
            }}
            readOnly={!onFilter}
          />
        </div>
      )}
    </div>
  );
};

export default EventFilter;
