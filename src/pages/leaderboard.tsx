import { LeaderboardRow, SortDropdown, TopThreeCard } from '@/components/leaderboard';
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
import { useEffect, useMemo, useRef, useState } from 'react';

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

interface LeaderboardProps {
  authToken: string;
  initLeaderboard: PublicProfile[];
  user: PrivateProfile;
}

const LeaderboardPage = ({ authToken, initLeaderboard, user: { uuid } }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState(initLeaderboard);

  const [query, setQuery] = useState('');
  const myPosition = useRef<HTMLAnchorElement>(null);

  const endYear = useMemo(getEndYear, []);
  const years = [];
  for (let year = START_YEAR + 1; year <= endYear; year += 1) {
    years.unshift({ value: String(year), label: `${year - 1}–${year}` });
  }
  const [sort, setSort] = useState<string>(String(endYear));
  const params = useMemo(() => getLeaderboardRange(sort), [sort]);
  useEffect(() => {
    LeaderboardAPI.getLeaderboard(authToken, params).then(setLeaderboard);
  }, [authToken, params]);

  const results = leaderboard.map((user, index) => ({ ...user, position: index + 1 }));
  const topThreeUsers = query === '' ? filter(results.slice(0, 3), query) : [];
  const leaderboardRows = filter(query === '' ? results.slice(3) : results, query);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Leaderboard</h1>
        <button
          className={styles.myPosition}
          type="button"
          onClick={() => {
            myPosition.current?.scrollIntoView();
            // Remove `.flash` in case it was already applied
            myPosition.current?.classList.remove(styles.flash);
            window.requestAnimationFrame(() => {
              myPosition.current?.classList.add(styles.flash);
            });
          }}
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
          onChange={e => setQuery(e.currentTarget.value)}
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
                rowRef={user.uuid === uuid ? myPosition : null}
              />
            );
          })}
        </div>
      )}
      {topThreeUsers.length === 0 && leaderboardRows.length === 0 && <p>No results.</p>}
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
