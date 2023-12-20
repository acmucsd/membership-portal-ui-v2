import EventDisplay from '@/components/events/EventDisplay';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  user: PrivateProfile;
  events: PublicEvent[];
  attendances: PublicAttendance[];
}

const PortalHomePage = ({ user, events, attendances }: HomePageProps) => {
  return (
    <div>
      <h1>Portal Home Page</h1>
      <pre>User Info: {JSON.stringify(user, null, 2)}</pre>
      <EventDisplay events={events} attendances={attendances} />
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const events = await EventAPI.getAllEvents();
  const attendances = await EventAPI.getAttendancesForUser(authToken);

  return { props: { events, attendances } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
