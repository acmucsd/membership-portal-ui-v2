import protectPage from '@/lib/hoc/protectPage';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const DiscordPage = () => {
  return <h1>Discord Page</h1>;
};

export default DiscordPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = protectPage(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
