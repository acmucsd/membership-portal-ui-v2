import { EventCarousel } from '@/components/events';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/Home.module.scss';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  pastEvents: PublicEvent[];
  upcomingEvents: PublicEvent[];
  liveEvents: PublicEvent[];
  attendances: PublicAttendance[];
}

const PortalHomePage = ({ pastEvents, upcomingEvents, liveEvents, attendances }: HomePageProps) => {
  return (
    <div className={styles.page}>
      {liveEvents.length > 0 && (
        <EventCarousel
          title="Live Events"
          description="Blink and you'll miss it! These events are happening RIGHT NOW!"
          events={liveEvents}
          attendances={attendances}
        />
      )}

      {upcomingEvents.length > 0 && (
        <EventCarousel
          title="Upcoming Events"
          description="Mark your calendars! These events are just around the corner!"
          events={upcomingEvents.slice(0, 10)} // Slicing past events so the carousel doesn't balloon.
          attendances={attendances}
        />
      )}

      {pastEvents.length > 0 && (
        <EventCarousel
          title="Past Events"
          description="Take a look at some of ACM's past events!"
          events={pastEvents.slice(0, 10)} // Slicing past events so the carousel doesn't balloon.
          attendances={attendances}
        />
      )}
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const getEvents = EventAPI.getAllEvents();
  const getAttendances = EventAPI.getAttendancesForUser(authToken);

  const [events, attendances] = await Promise.all([getEvents, getAttendances]);

  const now = new Date();
  const pastEvents: PublicEvent[] = [];
  const upcomingEvents: PublicEvent[] = [];
  const liveEvents: PublicEvent[] = [];

  events.forEach(e => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    if (end < now) {
      pastEvents.push(e);
    } else if (start > now) {
      upcomingEvents.push(e);
    } else {
      liveEvents.push(e);
    }
  });

  return { props: { pastEvents, upcomingEvents, liveEvents, attendances } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
