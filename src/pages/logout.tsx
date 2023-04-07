import { config } from '@/lib';
import { CookieService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next';

/**
 * `/logout` route to handle logout by ensuring user cookie is cleared and redirecting to login screen without rendering a page
 */
const LogoutPage = () => {
  return null;
};

export default LogoutPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  CookieService.deleteServerCookie(CookieType.USER, { req, res });
  CookieService.deleteServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  return {
    redirect: {
      destination: config.loginRoute,
      permanent: true,
    },
  };
};
