import {
  UserHandleNotFound,
  UserHandleNotFoundProps,
  UserProfilePage,
  UserProfilePageProps,
} from '@/components/profile';
import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next/types';

type UserHandlePageProps = UserHandleNotFoundProps | UserProfilePageProps;

const isUserHandleNotFound = (props: UserHandlePageProps): props is UserHandleNotFoundProps =>
  'handle' in props;

const UserHandlePage = (props: UserHandlePageProps) => {
  if (isUserHandleNotFound(props)) {
    const { handle } = props;
    return <UserHandleNotFound handle={handle} />;
  }

  return <UserProfilePage {...props} />;
};

export default UserHandlePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const handle = params?.handle as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const [handleUser, user, signedInAttendances] = await Promise.all([
      UserAPI.getUserByHandle(token, handle).catch(() => null),
      UserAPI.getCurrentUserAndRefreshCookie(token, { req, res }),
      UserAPI.getAttendancesForCurrentUser(token),
    ]);

    // render UserHandleNotFoundPage when user with handle is not retrieved
    if (handleUser === null) return { props: { handle } };

    const isSignedInUser = handleUser.uuid === user.uuid;

    let attendances = null;
    if (!isSignedInUser && handleUser.isAttendancePublic)
      attendances = await UserAPI.getAttendancesForUserByUUID(token, handleUser.uuid);

    // render UserProfilePage
    return {
      props: {
        handleUser,
        isSignedInUser,
        signedInAttendances,
        attendances,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.homeRoute, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
