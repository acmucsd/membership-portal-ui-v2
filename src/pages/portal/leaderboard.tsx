import protectPage from '@/lib/hoc/protectPage';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const PortalLeaderboardPage = () => {
  return <h1>Portal Leaderboard Page</h1>;
};

export default PortalLeaderboardPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = protectPage(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
