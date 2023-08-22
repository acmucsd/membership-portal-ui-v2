import { LeaderboardRow, TopThreeCard } from '@/components/leaderboard';
import { LeaderboardAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import styles from '@/styles/pages/leaderboard.module.scss';
import { GetServerSideProps } from 'next';
import { useRef, useState } from 'react';

function filter<T extends PublicProfile>(users: T[], query: string): T[] {
  if (query === '') {
    return users;
  }
  const search = query.toLowerCase();
  return users.filter(user => `${user.firstName} ${user.lastName}`.toLowerCase().includes(search));
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
          type="button"
          onClick={() => {
            myPosition.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          My Position
        </button>
        <input
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
