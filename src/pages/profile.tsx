import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps, NextPage } from 'next';

const UserProfilePage: NextPage = () => null;

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const user = JSON.parse(CookieService.getServerCookie(CookieType.USER, { req, res }));

  return {
    redirect: {
      destination: `/u/${user.handle}`,
      permanent: true,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
