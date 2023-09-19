import { LeaderboardRow, SortDropdown, TopThreeCard } from '@/components/leaderboard';
import { config } from '@/lib';
import { LeaderboardAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import MyPositionIcon from '@/public/assets/icons/my-position-icon.svg';
import styles from '@/styles/pages/leaderboard.module.scss';
import { GetServerSideProps } from 'next';
import { useMemo, useRef, useState } from 'react';

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

/** Year ACM was founded. */
const START_YEAR = 2019;

interface LeaderboardProps {
  leaderboard: PublicProfile[];
  user: PrivateProfile;
}

const LeaderboardPage = ({ leaderboard, user: { uuid } }: LeaderboardProps) => {
  const [query, setQuery] = useState('');
  const myPosition = useRef<HTMLAnchorElement>(null);

  const results = leaderboard.map((user, index) => ({ ...user, position: index + 1 }));
  const topThreeUsers = query === '' ? filter(results.slice(0, 3), query) : [];
  const leaderboardRows = filter(query === '' ? results.slice(3) : results, query);

  const endYear = useMemo(() => {
    const today = new Date();
    return today.getMonth() < 8 ? today.getFullYear() : today.getFullYear() + 1;
  }, []);
  const years = [];
  for (let year = START_YEAR + 1; year <= endYear; year += 1) {
    years.unshift({ value: String(year), label: `${year - 1}–${year}` });
  }
  const [sort, setSort] = useState<string>(String(endYear));

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

  // Get all leaderboard items
  const leaderboard = await LeaderboardAPI.getLeaderboard(AUTH_TOKEN, {
    limit: 0,
  });

  return {
    props: {
      leaderboard,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
