import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const DiscordPage = () => {
  return <h1>Discord Page</h1>;
};

export default DiscordPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: { title: 'Discord' },
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
