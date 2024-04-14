import { Typography } from '@/components/common';
import EventDetail from '@/components/events/EventDetail';
import { Feedback, FeedbackForm } from '@/components/feedback';
import { EventAPI, FeedbackAPI, UserAPI } from '@/lib/api';
import { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import type { PublicEvent, PublicFeedback } from '@/lib/types/apiResponses';
import { formatEventDate } from '@/lib/utils';
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

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({
  params,
  user,
  authToken: token,
}) => {
  const uuid = params?.uuid as string;

  // try {
  const [event, attendances, [feedback = null]] = await Promise.all([
    EventAPI.getEvent(uuid, token),
    user ? UserAPI.getAttendancesForCurrentUser(token) : [],
    user ? FeedbackAPI.getFeedback(token, { user: user.uuid, event: uuid }) : [],
  ]);
  return {
    props: {
      title: event.title,
      description: `${formatEventDate(event.start, event.end, true)} at ${event.location}\n\n${
        event.description
      }`,
      previewImage: event.cover,
      bigPreviewImage: true,
      token,
      event,
      attended: attendances.some(attendance => attendance.event.uuid === uuid),
      feedback,
    },
  };
  // } catch {
  //   return { notFound: true };
  // }
};

export const getServerSideProps = getServerSidePropsFunc;
