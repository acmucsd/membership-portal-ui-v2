import EventDisplay from '@/components/events/EventDisplay';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  user: PrivateProfile;
  pastEvents: PublicEvent[];
  futureEvents: PublicEvent[];
  currentEvents: PublicEvent[];
  attendances: PublicAttendance[];
}

const PortalHomePage = ({
  user,
  pastEvents,
  futureEvents,
  currentEvents,
  attendances,
}: HomePageProps) => {
  return (
    <div>
      <h1>Portal Home Page</h1>
      <pre>User Info: {JSON.stringify(user, null, 2)}</pre>

      <EventDisplay events={currentEvents} attendances={attendances} />
      <EventDisplay events={futureEvents} attendances={attendances} />
      <EventDisplay events={pastEvents} attendances={attendances} />
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const events = await EventAPI.getAllEvents();
  const attendances = await EventAPI.getAttendancesForUser(authToken);

  const now = new Date();
  const pastEvents: PublicEvent[] = [];
  const futureEvents: PublicEvent[] = [];
  const currentEvents: PublicEvent[] = [];

  events.forEach(e => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    if (end < now) {
      pastEvents.push(e);
    } else if (start > now) {
      futureEvents.push(e);
    } else {
      currentEvents.push(e);
    }
  });

  return { props: { pastEvents, futureEvents, currentEvents, attendances } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
