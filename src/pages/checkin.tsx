import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const CheckinPage = () => {};

export default CheckinPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ query }) => {
  const { code } = query;
  return { redirect: { destination: `/?code=${code}`, permanent: true } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
