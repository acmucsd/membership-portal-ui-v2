import {
  HandleNotFound,
  HandleNotFoundProps,
  UserProfilePage,
  UserProfilePageProps,
} from '@/components/profile';
import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next/types';

type UserHandlePageProps = HandleNotFoundProps | UserProfilePageProps;

const isHandleNotFound = (props: UserHandlePageProps): props is HandleNotFoundProps =>
  'handle' in props;

const UserHandlePage = (props: UserHandlePageProps) => {
  if (isHandleNotFound(props)) {
    const { handle } = props;
    return <HandleNotFound handle={handle} />;
  }

  return <UserProfilePage {...props} />;
};

export default UserHandlePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const handle = params?.handle as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const [user, signedInUser, signedInAttendances] = await Promise.all([
      UserAPI.getUserByHandle(token, handle).catch(() => null),
      UserAPI.getCurrentUser(token),
      UserAPI.getAttendancesForCurrentUser(token),
    ]);

    // render HandleNotFoundPage when user with handle is not retrieved
    if (user === null) return { props: { handle } };

    const isSignedInUser = user.uuid === signedInUser.uuid;

    // UserProfilePage without separate user attendance
    if (!user.isAttendancePublic || isSignedInUser) {
      return { props: { user, isSignedInUser, signedInAttendances } };
    }

    // UserProfilePage with separate user and signed-in attendances
    const attendances = await UserAPI.getAttendancesForUserByUUID(token, user.uuid);
    return {
      props: {
        user,
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
  PermissionService.allUserTypes()
);
