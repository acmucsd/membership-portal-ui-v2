import { CheckInModal, EventCarousel } from '@/components/events';
import Hero from '@/components/home/Hero';
import HomeActions from '@/components/home/HomeActions';
import { showToast } from '@/lib';
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
  attendedEvents: PublicEvent[];
  upcomingEvents: PublicEvent[];
  attendances: PublicAttendance[];
  checkInResponse: PublicEvent | { error: string } | null;
}

const processCheckInResponse = (
  response: PublicEvent | { error: string }
): PublicEvent | undefined => {
  if ('uuid' in response) {
    // If the response contains a uuid, the response is a PublicEvent.
    return response;
  }
  showToast('Unable to checkin!', response.error);
  return undefined;
};

const PortalHomePage = ({
  user,
  attendedEvents,
  upcomingEvents,
  attendances,
  checkInResponse,
}: HomePageProps) => {
  const [points, setPoints] = useState<number>(user.points);
  const [checkinEvent, setCheckinEvent] = useState<PublicEvent | undefined>(undefined);
  const [checkinModalVisible, setCheckinModalVisible] = useState<boolean>(false);
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
      setCheckinEvent(event);
      setCheckinModalVisible(true);
    }
  };

  useEffect(() => {
    if (checkInResponse) {
      // In dev mode, this runs twice because of reactStrictMode in nextConfig.
      // This will only be run once in prod or deployment.
      const event = processCheckInResponse(checkInResponse);
      if (event) {
        setCheckinEvent(event);
        setCheckinModalVisible(true);
      }
    }
  }, [checkInResponse, user]);

  return (
    <div className={styles.page}>
      <CheckInModal
        open={checkinModalVisible}
        event={checkinEvent}
        onClose={() => setCheckinModalVisible(false)}
      />
      <Hero user={user} points={points} checkin={code => checkin(code)} />

      <div className={styles.row}>
        <div className={styles.desktop}>
          <HomeActions user={user} points={points} checkin={checkin} />
        </div>
        {upcomingEvents.length > 0 ? (
          <EventCarousel title="Upcoming Events" events={upcomingEvents} attendances={attendance} />
        ) : null}
      </div>

      {attendedEvents.length > 0 ? (
        <EventCarousel
          title="Recently Attended Events"
          events={attendedEvents}
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
  const attendedEvents: PublicEvent[] = [];
  const upcomingEvents: PublicEvent[] = [];

  events.forEach(e => {
    const end = new Date(e.end);
    if (attendances.some(a => a.event.uuid === e.uuid)) {
      attendedEvents.push(e);
    }
    if (end >= now) {
      upcomingEvents.push(e);
    }
  });

  return {
    props: {
      user,
      attendedEvents: attendedEvents.slice(-10).reverse(),
      upcomingEvents: upcomingEvents.slice(0, 10),
      attendances,
      checkInResponse: checkInResponse,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
