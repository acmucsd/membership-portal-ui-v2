import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next/types';

interface UserProfilePageProps {
  user: PublicProfile;
}

const UserProfilePage = ({ user }: UserProfilePageProps) => {
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const handle = params?.handle as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const user = await UserAPI.getUserByHandle(token, handle);
    return {
      props: {
        user,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.homeRoute, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser()
);
