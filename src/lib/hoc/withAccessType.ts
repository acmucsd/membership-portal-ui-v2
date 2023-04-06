import config from '@/lib/config';
import { CookieService } from '@/lib/services';
import { URL } from '@/lib/types';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType, UserAccessType } from '@/lib/types/enums';
import * as _ from 'lodash';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

/**
 * Redirects to login if user is not logged in and allowed to see the specified page
 * @param gssp Server-side props function to run afterwards
 * @param validAccessTypes Access types that can see this page
 * @returns
 */
export default function withAccessType(
  gssp: GetServerSideProps,
  validAccessTypes: UserAccessType[],
  redirectTo?: URL
): GetServerSideProps {
  // Generate a new getServerSideProps function by taking the return value of the original function and appending the user prop onto it if the user cookie exists, otherwise force user to login page
  const modified: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    // Initialize variables
    const { req, res } = context;
    const originalReturnValue = await gssp(context);

    // Save current URL so user can return here after logging in
    const currentUrl = encodeURIComponent(req.url ?? '/');

    const baseRoute = redirectTo ?? config.loginRoute;
    const destinationRoute =
      baseRoute === config.loginRoute ? `${baseRoute}?destination=${currentUrl}` : baseRoute;

    const safeRedirectToLogin = {
      redirect: {
        destination: destinationRoute,
        permanent: false,
      },
    };

    // Get user cookie
    const userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });

    // If cookie is misisng, we are not logged in so don't show the current page
    if (!userCookie) {
      if (currentUrl === config.homeRoute) {
        return {
          redirect: {
            destination: currentUrl,
            permanent: false,
          },
        };
      }
      return safeRedirectToLogin;
    }

    // Once we have the cookie, read the user data
    const user: PrivateProfile = JSON.parse(userCookie);

    if (!validAccessTypes.includes(user.accessType)) return safeRedirectToLogin;

    // If we haven't short-circuited, user is valid. Show the page and add the user prop.
    const propsWithUser = {
      props: {
        user,
      },
    };

    // Append user at the start so it can be overridden if necessary using deep merge so we don't delete the whole props object
    const finalObj = _.merge(propsWithUser, originalReturnValue);
    return finalObj;
  };
  return modified;
}
