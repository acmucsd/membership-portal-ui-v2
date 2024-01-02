import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { GetServerSideProps, NextPage } from 'next';

const UserProfilePage: NextPage = () => {
  return <h1>Portal Profile Page</h1>;
};

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser()
);
