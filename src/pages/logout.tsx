import { config } from '@/lib';
import { CookieService } from '@/lib/services';
import type { GetServerSideProps } from 'next';

/**
 * `/logout` route to handle logout by ensuring user cookie is cleared and redirecting to login screen without rendering a page
 */
const LogoutPage = () => null;

export default LogoutPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  CookieService.clearServerCookies({ req, res });

  return {
    redirect: {
      destination: config.loginRoute,
      permanent: true,
    },
  };
};
