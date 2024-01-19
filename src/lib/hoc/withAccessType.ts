import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import type { URL } from '@/lib/types';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType, UserAccessType } from '@/lib/types/enums';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
/**
 * Redirects to login if user is not logged in and allowed to see the specified page
 * @param gssp Server-side props function to run afterwards
 * @param validAccessTypes Access types that can see this page
 * @param redirectTo URL to send users without valid access level
 * @returns
 */
export default function withAccessType(
  gssp: GetServerSideProps,
  validAccessTypes: UserAccessType[],
  redirectTo?: URL
): GetServerSideProps {
  // Generate a new getServerSideProps function by taking the return value of the original function and appending the user prop onto it if the user cookie exists, otherwise force user to login page
  const modified: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    let userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });
    const authTokenCookie = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

    const { homeRoute, loginRoute } = config;
    const currentPageURL = req.url as string;
    const recoveryQueryString = `?destination=${encodeURIComponent(currentPageURL)}`;
    const loginRedirectURL = loginRoute;
    const missingAccessRedirectURL = redirectTo ?? loginRoute;

    const loginRedirect = {
      redirect: {
        destination: `${loginRedirectURL}${
          currentPageURL !== homeRoute ? recoveryQueryString : ''
        }`,
        permanent: false,
      },
    };
    const missingAccessRedirect = {
      redirect: {
        destination: `${missingAccessRedirectURL}${
          missingAccessRedirectURL === loginRoute ? recoveryQueryString : ''
        }`,
        permanent: false,
      },
    };

    // If no auth token, kick to login screen
    if (!authTokenCookie) {
      return loginRedirect;
    }

    let user: PrivateProfile | undefined;
    let userAccessLevel: UserAccessType | undefined;

    if (userCookie) {
      // Standard flow will use the existing user cookie as src data unless it's corrupted or missing keys, then try to refresh user otherwise redirect on fail
      try {
        user = JSON.parse(userCookie);
        userAccessLevel = user?.accessType;
      } catch {
        user = undefined;
      }
    }

    if (!user || !userAccessLevel) {
      user = await UserAPI.getCurrentUser(authTokenCookie);
      userAccessLevel = user.accessType;
      userCookie = JSON.stringify(user);
      CookieService.setServerCookie(CookieType.USER, JSON.stringify(userCookie), { req, res });
    }

    // This block should be impossible to hit assuming the portal API doesn't go down
    if (!userAccessLevel) throw new Error('User access level is not defined');

    /* If the user does not have the right access, redirect as specified */
    if (!validAccessTypes.includes(userAccessLevel)) return missingAccessRedirect;

    // If we haven't short-circuited, user has valid access. Show the page and add the user prop.
    const originalReturnValue = await gssp(context);
    // Insert the user object to the original return value if it doesn't exist already
    if ('props' in originalReturnValue) {
      const existingProps = await Promise.resolve(originalReturnValue.props);
      if (!existingProps.user) {
        existingProps.user = user;
        originalReturnValue.props = existingProps;
      }
    }

    return originalReturnValue;
  };
  return modified;
}
