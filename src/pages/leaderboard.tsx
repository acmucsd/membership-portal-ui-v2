import { Title } from '@/components/common';
import { LeaderboardRow, TopThreeCard } from '@/components/leaderboard';
import { LeaderboardAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import styles from '@/styles/pages/leaderboard.module.scss';
import { GetServerSideProps } from 'next';

interface LeaderboardProps {
  leaderboard: PublicProfile[];
}

const LeaderboardPage = (props: LeaderboardProps) => {
  const { leaderboard } = props;

  const topThreeUsers = leaderboard.slice(0, 3);

  const leaderboardRows = leaderboard.slice(3);

  return (
    <div className={styles.container}>
      <Title heading="Leaderboard">
        <select name="timeOptions" id="timeOptions">
          <option>All Time</option>
        </select>
      </Title>
      <div className={styles.topThreeContainer}>
        {topThreeUsers.map((user, index) => (
          <TopThreeCard
            key={user.uuid}
            position={index + 1}
            rank={getUserRank(user)}
            name={`${user.firstName} ${user.lastName}`}
            points={user.points}
            image={getProfilePicture(user)}
          />
        ))}
      </div>
      <div className={styles.leaderboard}>
        {leaderboardRows.map((user, index) => {
          return (
            <LeaderboardRow
              key={user.uuid}
              position={index + 4}
              rank={getUserRank(user)}
              name={`${user.firstName} ${user.lastName}`}
              points={user.points}
              image={getProfilePicture(user)}
            />
          );
        })}
      </div>
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
