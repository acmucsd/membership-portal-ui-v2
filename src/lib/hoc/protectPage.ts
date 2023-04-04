import { CookieService } from '@/lib/services';
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
export default function protectPage(
  gssp: GetServerSideProps,
  validAccessTypes: UserAccessType[]
): GetServerSideProps {
  const modified: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    // Initialize variables
    const { req, res } = context;

    const originalReturnValue = await gssp(context);
    const safeRedirectToLogin = {
      redirect: {
        destination: `/?redirect=`, // TODO: Save previous URL to redirect on login
        permanent: false,
      },
    };

    // Get user cookie
    const userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });

    // If cookie is misisng, we are not logged in so don't show the current page
    if (!userCookie) return safeRedirectToLogin;

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
