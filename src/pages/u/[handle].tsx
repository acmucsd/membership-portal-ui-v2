import {
  UserHandleNotFound,
  UserHandleNotFoundProps,
  UserProfilePage,
  UserProfilePageProps,
} from '@/components/profile';
import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { getProfilePicture } from '@/lib/utils';

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

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({
  params,
  req,
  res,
  authToken,
}) => {
  const handle = params?.handle as string;

  try {
    const [handleUser, user, signedInAttendances] = await Promise.all([
      UserAPI.getUserByHandle(authToken, handle).catch(() => null),
      UserAPI.getCurrentUserAndRefreshCookie(authToken, { req, res }),
      UserAPI.getAttendancesForCurrentUser(authToken),
    ]);

    // render UserHandleNotFoundPage when user with handle is not retrieved
    if (handleUser === null) return { props: { handle } };

    const isSignedInUser = handleUser.uuid === user.uuid;

    // If the user is viewing their own page, then re-use signedInAttendances.
    // We return the 10 most recently attended events.
    let recentAttendances = signedInAttendances.slice(-10).reverse();
    // Otherwise, fetch the viewed user's attendances.
    if (!isSignedInUser && handleUser.isAttendancePublic)
      recentAttendances = (await UserAPI.getAttendancesForUserByUUID(authToken, handleUser.uuid))
        .slice(-10)
        .reverse();

    // render UserProfilePage
    return {
      props: {
        title: `${handleUser.firstName} ${handleUser.lastName}`,
        description: handleUser.bio,
        previewImage: getProfilePicture(handleUser),
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
