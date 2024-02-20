import { EventCarousel } from '@/components/events';
import Hero from '@/components/home/Hero';
import { config, showToast } from '@/lib';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { attendEvent } from '@/lib/managers/EventManager';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/Home.module.scss';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

interface HomePageProps {
  user: PrivateProfile;
  pastEvents: PublicEvent[];
  upcomingEvents: PublicEvent[];
  liveEvents: PublicEvent[];
  attendances: PublicAttendance[];
  checkInResponse: PublicEvent | { error: string } | null;
}

const processCheckInResponse = (
  response: PublicEvent | { error: string }
): PublicEvent | undefined => {
  if ('uuid' in response) {
    // If the response contains a uuid, the response is a PublicEvent.
    const title = `Checked in to ${response.title}!`;
    const subtitle = `Thanks for checking in! You earned ${response.pointValue} points.`;
    showToast(title, subtitle);
    return response;
  }
  showToast('Unable to checkin!', response.error);
  return undefined;
};

const PortalHomePage = ({
  user,
  pastEvents,
  upcomingEvents,
  liveEvents,
  attendances,
  checkInResponse,
}: HomePageProps) => {
  const [points, setPoints] = useState<number>(user.points);
  const [attendance, setAttendance] = useState<PublicAttendance[]>(attendances);

  const checkin = async (attendanceCode: string): Promise<void> => {
    const token = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    const response = await attendEvent({ token, attendanceCode });
    const event = processCheckInResponse(response);
    if (event) {
      // This client side code prevents us from having to refetch
      // user and attendance from the API after a successful checkin.
      setPoints(p => p + event.pointValue);
      const newAttendance: PublicAttendance = {
        user: user,
        event,
        timestamp: new Date(),
        asStaff: false,
        feedback: [],
      };
      setAttendance(prevAttendances => [...prevAttendances, newAttendance]);
    }
  };

  useEffect(() => {
    if (checkInResponse) {
      // In dev mode, this runs twice because of reactStrictMode in nextConfig.
      // This will only be run once in prod or deployment.
      processCheckInResponse(checkInResponse);
      // Clear the query params without re-triggering getServerSideProps.
      window.history.replaceState(null, '', config.homeRoute);
    }
  }, [checkInResponse]);

  return (
    <div className={styles.page}>
      <Hero firstName={user.firstName} points={points} checkin={code => checkin(code)} />

      {liveEvents.length > 0 ? (
        <EventCarousel
          title="Live Events"
          description="Blink and you'll miss it! These events are happening RIGHT NOW!"
          events={liveEvents}
          attendances={attendance}
        />
      ) : null}

      {upcomingEvents.length > 0 ? (
        <EventCarousel
          title="Upcoming Events"
          description="Mark your calendars! These events are just around the corner!"
          events={upcomingEvents} // Slicing past events so the carousel doesn't balloon.
          attendances={attendance}
        />
      ) : null}

      {pastEvents.length > 0 ? (
        <EventCarousel
          title="Past Events"
          description="Take a look at some of ACM's past events!"
          events={pastEvents} // Slicing past events so the carousel doesn't balloon.
          attendances={attendance}
        />
      ) : null}
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  let checkInResponse = null;
  if (typeof query.code === 'string') {
    // If a check-in code is specified, first check in to that event.
    checkInResponse = await attendEvent({ token: authToken, attendanceCode: query.code });
  }

  // After that, fetch the other API calls.
  const eventsPromise = EventAPI.getAllEvents();
  const attendancesPromise = UserAPI.getAttendancesForCurrentUser(authToken);
  const userPromise = UserAPI.getCurrentUserAndRefreshCookie(authToken, { req, res });

  const [events, attendances, user] = await Promise.all([
    eventsPromise,
    attendancesPromise,
    userPromise,
  ]);

  // Filter out events by time.
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
      user,
      pastEvents: pastEvents.slice(-10).reverse(),
      upcomingEvents: upcomingEvents.slice(0, 10),
      liveEvents,
      attendances,
      checkInResponse: checkInResponse,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
