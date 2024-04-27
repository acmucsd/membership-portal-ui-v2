import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { NextPage } from 'next';

const UserProfilePage: NextPage = () => null;

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ req, res, authToken }) => {
  const user = await UserAPI.getCurrentUserAndRefreshCookie(authToken, { req, res });

  return {
    redirect: {
      destination: `${config.userProfileRoute}${user.handle}`,
      permanent: false,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
