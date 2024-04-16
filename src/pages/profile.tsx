import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps, NextPage } from 'next';

const UserProfilePage: NextPage = () => null;

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const user = await UserAPI.getCurrentUserAndRefreshCookie(token, { req, res });

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
