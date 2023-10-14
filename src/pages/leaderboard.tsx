import { LeaderboardRow, SortDropdown, TopThreeCard } from '@/components/leaderboard';
import PaginationControls from '@/components/leaderboard/PaginationControls';
import { config } from '@/lib';
import { LeaderboardAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { SlidingLeaderboardQueryParams } from '@/lib/types/apiRequests';
import { PrivateProfile, PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import MyPositionIcon from '@/public/assets/icons/my-position-icon.svg';
import styles from '@/styles/pages/leaderboard.module.scss';
import { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';

/** Year ACM was founded. */
const START_YEAR = 2019;
/** Number of seconds in a day. */
const DAY_SECONDS = 86400;

interface Match {
  index: number;
  length: number;
}
function filter<T extends PublicProfile>(users: T[], query: string): (T & { match?: Match })[] {
  const search = query.toLowerCase();
  return users.flatMap(user => {
    const index = `${user.firstName} ${user.lastName}`.toLowerCase().indexOf(search);
    return index !== -1 ? [{ ...user, match: { index, length: search.length } }] : [];
  });
}

function getEndYear(): number {
  const today = new Date();
  // Arbitrarily start the next academic year in August
  return today.getMonth() < 7 ? today.getFullYear() : today.getFullYear() + 1;
}

function getLeaderboardRange(sort: string | number, limit = 0): SlidingLeaderboardQueryParams {
  const params: SlidingLeaderboardQueryParams = { limit };
  const now = Date.now() / 1000;
  switch (sort) {
    case 'past-week': {
      params.from = now - DAY_SECONDS * 7;
      break;
    }
    case 'past-month': {
      params.from = now - DAY_SECONDS * 28;
      break;
    }
    case 'past-year': {
      params.from = now - DAY_SECONDS * 365;
      break;
    }
    case 'all-time': {
      break;
    }
    default: {
      const year = +sort;
      // Arbitrarily academic years on August 1, which should be during the summer
      params.from = new Date(year - 1, 7, 1).getTime() / 1000;
      params.to = new Date(year, 7, 1).getTime() / 1000;
    }
  }
  return params;
}

const ROWS_PER_PAGE = 15;

interface LeaderboardProps {
  authToken: string;
  initLeaderboard: PublicProfile[];
  user: PrivateProfile;
}

const LeaderboardPage = ({ authToken, initLeaderboard, user: { uuid } }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState(initLeaderboard);

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [scrollIntoView, setScrollIntoView] = useState(false);

  const endYear = useMemo(getEndYear, []);
  const years = useMemo(() => {
    const years = [];
    for (let year = START_YEAR + 1; year <= endYear; year += 1) {
      years.unshift({ value: String(year), label: `${year - 1}–${year}` });
    }
    return years;
  }, [endYear]);

  const [sort, setSort] = useState(String(endYear));
  useEffect(() => {
    LeaderboardAPI.getLeaderboard(authToken, getLeaderboardRange(sort)).then(setLeaderboard);
  }, [authToken, sort]);

  const { allRows, myIndex } = useMemo(() => {
    const results = leaderboard.map((user, index) => ({ ...user, position: index + 1 }));
    const allRows = filter(results, query);
    const myIndex = allRows.findIndex(row => row.uuid === uuid);
    return { allRows, myIndex };
  }, [leaderboard, query, uuid]);

  const topThreeUsers = page === 0 && query === '' ? allRows.slice(0, 3) : [];
  const leaderboardRows =
    page === 0 && query === ''
      ? allRows.slice(3, ROWS_PER_PAGE)
      : allRows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Leaderboard</h1>
        <button
          className={styles.myPosition}
          type="button"
          onClick={() => {
            setPage(Math.floor(myIndex / ROWS_PER_PAGE));
            setScrollIntoView(true);
          }}
          disabled={myIndex === -1}
        >
          My Position
          <MyPositionIcon />
        </button>
        <input
          className={styles.search}
          type="search"
          placeholder="Search Users"
          aria-label="Search Users"
          value={query}
          onChange={e => {
            setQuery(e.currentTarget.value);
            setPage(0);
          }}
        />
        <SortDropdown
          name="timeOptions"
          ariaLabel="Filter the leaderboard by"
          options={[
            { value: 'past-week', label: 'Past week' },
            { value: 'past-month', label: 'Past month' },
            { value: 'past-year', label: 'Past year' },
            { value: 'all-time', label: 'All time' },
            '---',
            ...years,
          ]}
          value={sort}
          onChange={setSort}
        />
      </div>
      {topThreeUsers.length > 0 && (
        <div className={styles.topThreeContainer}>
          {topThreeUsers.map(user => (
            <TopThreeCard
              key={user.uuid}
              position={user.position}
              rank={getUserRank(user)}
              name={`${user.firstName} ${user.lastName}`}
              url={`${config.userProfileRoute}${user.handle}`}
              points={user.points}
              image={getProfilePicture(user)}
            />
          ))}
        </div>
      )}
      {leaderboardRows.length > 0 && (
        <div className={styles.leaderboard}>
          {leaderboardRows.map(user => {
            return (
              <LeaderboardRow
                key={user.uuid}
                position={user.position}
                rank={getUserRank(user)}
                name={`${user.firstName} ${user.lastName}`}
                url={`${config.userProfileRoute}${user.handle}`}
                points={user.points}
                image={getProfilePicture(user)}
                match={user.match}
                scrollIntoView={scrollIntoView && user.uuid === uuid}
              />
            );
          })}
        </div>
      )}
      {allRows.length > 0 ? (
        <PaginationControls
          page={page}
          onPage={setPage}
          pages={Math.ceil(allRows.length / ROWS_PER_PAGE)}
        />
      ) : (
        <p>No results.</p>
      )}
    </div>
  );
};

export default LeaderboardPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  // Only render first 100 leaderboard items on the back end
  const initLeaderboard = await LeaderboardAPI.getLeaderboard(
    AUTH_TOKEN,
    getLeaderboardRange(getEndYear(), 100)
  );

  return {
    props: {
      authToken: AUTH_TOKEN,
      initLeaderboard,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
