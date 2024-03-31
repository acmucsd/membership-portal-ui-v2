import EventDetail from '@/components/events/EventDetail';
import FeedbackForm from '@/components/events/FeedbackForm';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/event.module.scss';
import type { GetServerSideProps } from 'next';
import { useMemo } from 'react';

interface EventPageProps {
  token: string;
  event: PublicEvent;
  attended: boolean;
}
const EventPage = ({ token, event, attended }: EventPageProps) => {
  const started = useMemo(() => new Date() >= new Date(event.start), [event.start]);

  return (
    <div className={styles.page}>
      <EventDetail event={event} attended={attended} />
      {started ? <FeedbackForm event={event} authToken={token} /> : null}
    </div>
  );
};

export default EventPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const [event, attendances] = await Promise.all([
      EventAPI.getEvent(uuid, token),
      UserAPI.getAttendancesForCurrentUser(token),
    ]);
    return {
      props: {
        title: event.title,
        token,
        event,
        attended: attendances.some(attendance => attendance.event.uuid === uuid),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
