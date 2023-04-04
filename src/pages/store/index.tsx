import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const StoreHomePage = () => {
  return <h1>Store Home Page</h1>;
};

export default StoreHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
