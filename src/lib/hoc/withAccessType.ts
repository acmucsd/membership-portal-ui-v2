import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import type { URL } from '@/lib/types';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType, UserAccessType } from '@/lib/types/enums';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

/**
 * Tries to read the user object from the cookie. If the user object doesn't
 * exist or is invalid, then it will try to fetch a new one with the auth token.
 */
export async function getCurrentUser(
  { req, res }: Pick<GetServerSidePropsContext, 'req' | 'res'>,
  authToken: string
): Promise<PrivateProfile> {
  const userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });
  let user: PrivateProfile | undefined;

  if (userCookie) {
    // Standard flow will use the existing user cookie as src data unless it's corrupted or missing keys, then try to refresh user otherwise redirect on fail
    try {
      user = JSON.parse(userCookie);
    } catch {
      user = undefined;
    }
  }

  if (!user?.accessType) {
    user = await UserAPI.getCurrentUserAndRefreshCookie(authToken, { req, res });
  }

  return user;
}

export type GetServerSidePropsWithAuth<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Params, Preview> & { user: PrivateProfile; authToken: string }
) => Promise<GetServerSidePropsResult<Props>>;

interface AccessTypeOptions {
  /**
   * URL to send users without valid access level
   */
  redirectTo?: URL;
}

/**
 * Redirects to login if user is not logged in and allowed to see the specified page
 * @param gssp Server-side props function to run afterwards
 * @param validAccessTypes Access types that can see this page
 * @param options Other page-specific options
 * @returns
 */
export default function withAccessType(
  gssp: GetServerSidePropsWithAuth,
  validAccessTypes: UserAccessType[],
  { redirectTo = config.loginRoute }: AccessTypeOptions = {}
): GetServerSideProps {
  // Generate a new getServerSideProps function by taking the return value of the original function and appending the user prop onto it if the user cookie exists, otherwise force user to login page
  const modified: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    const authTokenCookie = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

    const { homeRoute, loginRoute } = config;
    const currentPageURL = req.url as string;
    const recoveryQueryString = `?destination=${encodeURIComponent(currentPageURL)}`;
    const loginRedirectURL = loginRoute;
    const missingAccessRedirectURL = redirectTo;

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

    const user = await getCurrentUser({ req, res }, authTokenCookie);
    const userAccessLevel = user.accessType;

    // This block should be impossible to hit assuming the portal API doesn't go down
    if (!userAccessLevel) throw new Error('User access level is not defined');

    /* If the user does not have the right access, redirect as specified */
    if (!validAccessTypes.includes(userAccessLevel)) return missingAccessRedirect;

    // If we haven't short-circuited, user has valid access. Show the page and add the user prop.
    const originalReturnValue = await gssp({ ...context, user, authToken: authTokenCookie });
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
