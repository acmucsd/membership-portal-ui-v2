import protectPage from '@/lib/hoc/protectPage';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const StoreOrderPage = () => {
  return <h1>Store Order Page</h1>;
};

export default StoreOrderPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = protectPage(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
