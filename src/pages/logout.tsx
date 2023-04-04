import { CookieService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next';

const LogoutPage = () => {
  return <h1>Logout</h1>;
};

export default LogoutPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  CookieService.deleteServerCookie(CookieType.USER, { req, res });

  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
};
