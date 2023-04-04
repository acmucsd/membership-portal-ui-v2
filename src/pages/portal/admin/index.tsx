import { EventManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps } from 'next';

// interface AdminPageProps {
//   user: PrivateProfile;
//   events: PublicEvent[];
// }

const AdminPage = () => {
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
        destination: '/',
        permanent: false,
      },
    };
  }

  const user: PrivateProfile = JSON.parse(userCookie);

  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  if (!token) {
    return {
      redirect: {
        destination: '/',
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
