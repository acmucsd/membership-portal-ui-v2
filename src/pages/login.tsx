import Login from '@/components/common/Login';
import { config } from '@/lib';
import { CookieService } from '@/lib/services';
import { URL } from '@/lib/types';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps, NextPage } from 'next';

interface LoginProps {
  destination: URL;
}

const LoginPage: NextPage<LoginProps> = ({ destination }) => {
  return <Login destination={destination} full />;
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const user = CookieService.getServerCookie(CookieType.USER, { req, res });
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const route = query?.destination ? decodeURIComponent(query?.destination as string) : null;
  if (user && authToken) {
    return {
      redirect: {
        destination: route || config.homeRoute,
        permanent: false,
      },
    };
  }

  return {
    props: {
      destination: route || config.homeRoute,
    },
  };
};
