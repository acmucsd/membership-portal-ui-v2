import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import ShopIcon from '@/public/assets/icons/shop-icon.svg';
import styles from '@/styles/pages/index.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

interface HomePageProps {
  user: PrivateProfile;
}

const PortalHomePage = ({ user }: HomePageProps) => {
  return (
    <div>
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
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
