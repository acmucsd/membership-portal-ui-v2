import protectPage from '@/lib/hoc/protectPage';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const PortalProfilePage = () => {
  return <h1>Portal Profile Page</h1>;
};

export default PortalProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = protectPage(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
