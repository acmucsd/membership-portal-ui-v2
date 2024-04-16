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

    // If the user is viewing their own page, then re-use signedInAttendances.
    // We return the 10 most recently attended events.
    let recentAttendances = signedInAttendances.slice(-10).reverse();
    // Otherwise, fetch the viewed user's attendances.
    if (!isSignedInUser && handleUser.isAttendancePublic)
      recentAttendances = (await UserAPI.getAttendancesForUserByUUID(token, handleUser.uuid))
        .slice(-10)
        .reverse();

    // render UserProfilePage
    return {
      props: {
        title: `${handleUser.firstName} ${handleUser.lastName}`,
        handleUser,
        isSignedInUser,
        signedInAttendances,
        recentAttendances,
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
