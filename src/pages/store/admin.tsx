import protectPage from '@/lib/hoc/protectPage';
import { PermissionService } from '@/lib/services';
import type { GetServerSideProps } from 'next';

const StoreAdminPage = () => {
  return <h1>Store Admin Page</h1>;
};

export default StoreAdminPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = protectPage(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
