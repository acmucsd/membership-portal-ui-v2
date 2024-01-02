import { EventCarousel } from '@/components/events';
import Hero from '@/components/home/Hero';
import { showToast } from '@/lib';
import { EventAPI } from '@/lib/api';
import { attendEvent } from '@/lib/api/EventAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/Home.module.scss';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface HomePageProps {
  user: PrivateProfile;
  authToken: string;
  pastEvents: PublicEvent[];
  upcomingEvents: PublicEvent[];
  liveEvents: PublicEvent[];
  attendances: PublicAttendance[];
}

const checkin = async (token: string, code: string) => {
  try {
    const response = await attendEvent(token, code);
    if (response.event) {
      const title = `Checked in to ${response.event.title}!`;
      const subtitle = `Thanks for checking in! You earned ${response.event.pointValue} points.`;
      showToast(title, subtitle);
    } else if (response.error) {
      showToast('Unable to checkin!', response.error.message);
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      showToast('Unable to checkin!', e.response?.data.error.message);
    } else if (e instanceof Error) {
      showToast('Unable to checkin!', e.message);
    } else {
      showToast('Unable to checkin!');
    }
  }
};

const PortalHomePage = ({
  user,
  authToken,
  pastEvents,
  upcomingEvents,
  liveEvents,
  attendances,
}: HomePageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof router.query.code === 'string' && router.query.code) {
      // In dev mode, this runs twice because of reactStrictMode in nextConfig.
      // This will only be run once in prod or deployment.
      checkin(authToken, router.query.code).then(() => {
        // Clear out the query params without re-running getServerSideProps.
        router.replace('/', undefined, { shallow: true });
      });
    }
  }, [authToken, router]);

  return (
    <div className={styles.page}>
      <Hero user={user} checkin={code => checkin(authToken, code)} />

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
          events={pastEvents.slice(-10).reverse()} // Slicing past events so the carousel doesn't balloon.
          attendances={attendances}
        />
      )}
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const events = await EventAPI.getAllEvents();
  const attendances = await EventAPI.getAttendancesForUser(authToken);

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

  return {
    props: {
      pastEvents,
      upcomingEvents,
      liveEvents,
      attendances,
      authToken,
      checkinCode: query.code || null,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
