import { Typography } from '@/components/common';
import { CheckInModal, EventCarousel } from '@/components/events';
import { UserProgress } from '@/components/profile/UserProgress';
import { config, showToast } from '@/lib';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { attendEvent } from '@/lib/managers/EventManager';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import RaccoonGraphic from '@/public/assets/graphics/portal/raccoon-hero.svg';
import WavesGraphic from '@/public/assets/graphics/portal/waves.svg';
import CheckMark from '@/public/assets/icons/check-mark.svg';
import styles from '@/styles/pages/Home.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
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
  const [checkinCode, setCheckinCode] = useState('');
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

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.page}>
      <CheckInModal
        open={checkinModalVisible}
        event={checkinEvent}
        onClose={() => setCheckinModalVisible(false)}
      />

      <div className={styles.hero}>
        <RaccoonGraphic
          className={`${styles.image} ${styles.raccoon}`}
          alt="Raccoon lounging on a chair at a beach"
        />
        <WavesGraphic className={styles.image} alt="Ocean waves roll ashore" />
      </div>

      <div className={styles.content}>
        <Typography variant="h5/regular" className={styles.date}>
          {today}
        </Typography>
        <Typography variant="display/light/small" className={styles.heading} component="span">
          {'Welcome to ACM, '}
          <strong>
            <Link href={config.profileRoute}>{user.firstName}</Link>
          </strong>
          !
        </Typography>
      </div>

      <form
        className={styles.checkin}
        onSubmit={e => {
          e.preventDefault();
          if (checkinCode !== '') {
            checkin(checkinCode);
            setCheckinCode('');
          }
        }}
        action=""
      >
        <Typography variant="h2/bold" className={styles.subheading}>
          Event Check-in
        </Typography>
        <div className={styles.checkinButtons}>
          <input
            type="text"
            placeholder="Enter event check-in code"
            className={styles.checkinInput}
            value={checkinCode}
            onChange={e => setCheckinCode(e.target.value)}
          />
          <button type="submit" className={styles.submit}>
            <CheckMark />
          </button>
        </div>
      </form>

      <Link href={config.leaderboardRoute} className={styles.userProgress}>
        <UserProgress user={user} points={points} isSignedInUser />
      </Link>

      <EventCarousel
        title="Upcoming Events"
        initialEventFilters={{ date: 'upcoming', attended: 'any', community: 'all' }}
        titleClassName={styles.subheading}
        events={upcomingEvents}
        attendances={attendance}
        placeholder="Check back soon for upcoming events!"
        className={styles.upcomingEvents}
      />

      <EventCarousel
        initialEventFilters={{ attended: 'attended', date: 'all-time', community: 'all' }}
        title="Recently Attended Events"
        titleClassName={styles.subheading}
        events={attendedEvents}
        attendances={attendance}
        placeholder="Attend your first event and earn membership points!"
        className={styles.recentlyAttended}
      />
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
