import { EventCard } from '@/components/dashboard';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import styles from '@/styles/pages/index.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

interface HomePageProps {
  user: PrivateProfile;
  events: PublicEvent[];
}

const PortalHomePage = ({ user, events }: HomePageProps) => {
  return (
    <>
      <div className={styles.hero}>
        <form className={styles.heroContent}>
          <div className={styles.welcome}>
            <h1>
              Welcome to ACM, <strong>{user.firstName}</strong>.
            </h1>
            <p>
              You have <strong>{user.points}</strong> points.
            </p>
          </div>
          <div className={styles.row}>
            <label className={styles.checkIn}>
              <h2>Check in to an event</h2>
              <input type="text" placeholder="Check-in code" />
            </label>
            <div className={styles.links}>
              <Link href="/store">
                <ShopIcon />
                <span>Spend points on merch</span>
              </Link>
              <Link href="/leaderboard">
                <LeaderboardIcon />
                <span>Compete with friends</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className={styles.content}>
        <h2>Upcoming events</h2>
        <div className={styles.cards}>
          {events.map(({ uuid, cover, title, start, end, pointValue, location }, i) => (
            <EventCard
              key={uuid}
              cover={cover}
              title={title}
              start={start}
              end={end}
              pointValue={pointValue}
              location={location}
              // TEMP
              attended={i % 4 === 0}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {
    events: await EventAPI.getAllFutureEvents(),
  },
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
