import { LeaderboardRow, TopThreeCard } from '@/components/leaderboard';
import { LeaderboardAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import MyPositionIcon from '@/public/assets/icons/my-position-icon.svg';
import styles from '@/styles/pages/leaderboard.module.scss';
import { GetServerSideProps } from 'next';
import { useRef, useState } from 'react';

interface Match {
  index: number;
  length: number;
}
function filter<T extends PublicProfile>(users: T[], query: string): (T & { match?: Match })[] {
  if (query === '') {
    return users;
  }
  const search = query.toLowerCase();
  return users.flatMap(user => {
    const index = `${user.firstName} ${user.lastName}`.toLowerCase().indexOf(search);
    return index !== -1 ? [{ ...user, match: { index, length: search.length } }] : [];
  });
}

interface LeaderboardProps {
  leaderboard: PublicProfile[];
  user: PrivateProfile;
}

const LeaderboardPage = ({ leaderboard, user: { uuid } }: LeaderboardProps) => {
  const [query, setQuery] = useState('');
  const myPosition = useRef<HTMLDivElement>(null);

  const results = leaderboard.map((user, index) => ({ ...user, position: index + 1 }));
  const topThreeUsers = filter(results.slice(0, 3), query);
  const leaderboardRows = filter(results.slice(3), query);

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
        <select name="timeOptions" id="timeOptions">
          <option>All Time</option>
        </select>
      </div>
      {topThreeUsers.length > 0 && (
        <div className={styles.topThreeContainer}>
          {topThreeUsers.map(user => (
            <TopThreeCard
              key={user.uuid}
              position={user.position}
              rank={getUserRank(user)}
              name={`${user.firstName} ${user.lastName}`}
              points={user.points}
              image={getProfilePicture(user)}
              match={user.match}
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

  const leaderboard = await LeaderboardAPI.getLeaderboard(AUTH_TOKEN);

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
