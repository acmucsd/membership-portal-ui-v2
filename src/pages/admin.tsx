import { config } from '@/lib';
import { EventManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps, NextPage } from 'next';

const AdminPage: NextPage = () => {
  return (
    <div>
      <h1>Portal Admin Page</h1>
    </div>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });

  if (!userCookie) {
    return {
      redirect: {
        destination: config.loginRoute,
        permanent: false,
      },
    };
  }

  const user: PrivateProfile = JSON.parse(userCookie);

  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  if (!token) {
    return {
      redirect: {
        destination: config.loginRoute,
        permanent: false,
      },
    };
  }

  const events = await EventManager.getAllEvents({ token });

  return {
    props: {
      user,
      events,
    },
  };
};
