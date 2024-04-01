import { Typography } from '@/components/common';
import EventDetail from '@/components/events/EventDetail';
import { Feedback, FeedbackForm } from '@/components/feedback';
import { EventAPI, FeedbackAPI, UserAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithUser } from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicEvent, PublicFeedback } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/event.module.scss';
import { useMemo, useState } from 'react';

interface EventPageProps {
  token: string;
  event: PublicEvent;
  attended: boolean;
  feedback: PublicFeedback | null;
}
const EventPage = ({ token, event, attended, feedback: initFeedback }: EventPageProps) => {
  const started = useMemo(() => new Date() >= new Date(event.start), [event.start]);
  const [feedback, setFeedback] = useState(initFeedback);

  let feedbackForm = null;
  if (feedback) {
    feedbackForm = (
      <div className={styles.submittedFeedback}>
        <Typography variant="h2/bold" component="h2">
          Your Feedback
        </Typography>
        <Feedback feedback={feedback} />
      </div>
    );
  } else if (started) {
    feedbackForm = (
      <FeedbackForm event={event} attended={attended} authToken={token} onSubmit={setFeedback} />
    );
  }

  return (
    <div className={styles.page}>
      <EventDetail event={event} attended={attended} />
      {feedbackForm}
    </div>
  );
};

export default EventPage;

const getServerSidePropsFunc: GetServerSidePropsWithUser = async ({ params, req, res, user }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const [event, attendances, feedback] = await Promise.all([
      EventAPI.getEvent(uuid, token),
      UserAPI.getAttendancesForCurrentUser(token),
      FeedbackAPI.getFeedback(token),
    ]);
    return {
      props: {
        title: event.title,
        token,
        event,
        attended: attendances.some(attendance => attendance.event.uuid === uuid),
        feedback:
          feedback.find(
            feedback => feedback.event.uuid === uuid && feedback.user.uuid === user.uuid
          ) ?? null,
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
