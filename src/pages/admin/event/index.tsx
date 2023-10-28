import ManageEventCard from '@/components/admin/event/ManageEventCard';
import { Button } from '@/components/common';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { Community } from '@/lib/types/enums';
import style from '@/styles/pages/manage-events.module.scss';
import { IconButton } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight, FaThList } from 'react-icons/fa';

interface IProps {
  allEvents: PublicEvent[];
  pastEvents: PublicEvent[];
  futureEvents: PublicEvent[];
}

const NO_FILTER_OPTION = 'All Communities';
const communityFilterOptions = [
  NO_FILTER_OPTION,
  ...(Object.keys(Community) as Array<keyof typeof Community>).map(key => Community[key]),
];

const communityMatch = (event: PublicEvent, filter: string): boolean => {
  if (filter === NO_FILTER_OPTION) {
    return true;
  }
  return event.committee === filter;
};

const ManageAllEventsPage: NextPage<IProps> = (props: IProps) => {
  const router = useRouter();
  const { allEvents, pastEvents, futureEvents } = props;

  const [mode, setMode] = useState<'all' | 'past' | 'future'>('future');
  const [query, setQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'card' | 'row'>('row');
  const [communityFilter, setCommunityFilter] = useState<string>(NO_FILTER_OPTION);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginationSize, setPaginationSize] = useState<'All' | number>(5);

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

  const filteredEvents = visibleEvents
    .filter(event => communityMatch(event, communityFilter))
    .filter(event => event.title.toLowerCase().includes(query));

  const pageSize = paginationSize === 'All' ? filteredEvents.length : paginationSize;

  const nextPage = () => {
    if ((currentPage + 1) * pageSize < filteredEvents.length) {
      setCurrentPage(current => current + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(current => current - 1);
    }
  };

  const changePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'All') {
      setPaginationSize(e.target.value);
    } else {
      setPaginationSize(parseInt(e.target.value, 10));
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, query, communityFilter, mode]);

  const leftPageBound = currentPage * pageSize;
  const rightPageBound = Math.min((currentPage + 1) * pageSize, filteredEvents.length);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>Manage Events</h1>
        <div className={style.viewControls}>
          <IconButton onClick={() => setViewMode('card')}>
            <BsFillGrid3X3GapFill className={viewMode === 'card' ? style.active : style.inactive} />
          </IconButton>
          <IconButton onClick={() => setViewMode('row')}>
            <FaThList className={viewMode === 'row' ? style.active : style.inactive} />
          </IconButton>
        </div>
      </div>
      <div className={style.controls}>
        <div className={style.controlsLeft}>
          <div className={style.searchBar}>
            <AiOutlineSearch />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              type="text"
              placeholder="Search for an event..."
              className={style.searchInput}
            />
          </div>
          <select
            id="committee"
            value={communityFilter}
            onChange={e => setCommunityFilter(e.target.value)}
            className={style.searchBar}
          >
            {communityFilterOptions.map(filterOption => (
              <option key={filterOption}>{filterOption}</option>
            ))}
          </select>
          <Button
            onClick={() => router.push(config.admin.events.createRoute)}
            size="small"
            variant="primary"
          >
            Create New Event
          </Button>
        </div>
        <div className={style.modeControls}>
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
      </div>
      <div className={style.pagination}>
        <div className={style.paginationSizeControl}>
          <span>Items per page:</span>
          <select
            id="pageSize"
            value={pageSize}
            onChange={e => changePageSize(e)}
            className={style.paginationSizeSelect}
          >
            {['All', 5, 10, 20].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className={style.paginationSwitcher}>
          {`${leftPageBound + 1} - ${rightPageBound} of ${filteredEvents.length}`}
          <FaChevronLeft
            onClick={prevPage}
            className={style.paginationSwitcherArrow}
            aria-disabled={currentPage === 0}
          />
          <FaChevronRight
            onClick={nextPage}
            className={style.paginationSwitcherArrow}
            aria-disabled={rightPageBound >= filteredEvents.length}
          />
        </div>
      </div>
      <div className={viewMode === 'card' ? style.eventCardContainer : ''}>
        {filteredEvents.slice(leftPageBound, rightPageBound).map(event => (
          <ManageEventCard event={event} key={event.uuid} viewMode={viewMode} />
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
  config.admin.homeRoute
);
