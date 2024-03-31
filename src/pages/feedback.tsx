import { Typography } from '@/components/common';
import Feedback from '@/components/events/Feedback';
import { FeedbackAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicFeedback } from '@/lib/types/apiResponses';
import { CookieType, FeedbackStatus, UserAccessType } from '@/lib/types/enums';
import styles from '@/styles/pages/feedback.module.scss';
import type { GetServerSideProps } from 'next';

interface FeedbackPageProps {
  user: PrivateProfile;
  feedback: PublicFeedback[];
  token: string;
}
const FeedbackPage = ({ user, feedback, token }: FeedbackPageProps) => {
  /** Whether the user can respond to feedback */
  const isAdmin = user.accessType === UserAccessType.ADMIN;

  return (
    <div className={styles.page}>
      <Typography variant="h2/bold" component="h1">
        Feedback Submissions
      </Typography>
      {feedback
        .sort((a, b) => {
          // If admin, put SUBMITTED feedback on top
          if (isAdmin && a.status !== b.status) {
            return (
              (a.status === FeedbackStatus.SUBMITTED ? 0 : 1) -
              (b.status === FeedbackStatus.SUBMITTED ? 0 : 1)
            );
          }
          // Otherwise, just put most recent first
          return +new Date(b.timestamp) - +new Date(a.timestamp);
        })
        .map(feedback => (
          <Feedback
            key={feedback.uuid}
            feedback={feedback}
            showUser={isAdmin}
            responseToken={isAdmin ? token : null}
          />
        ))}
    </div>
  );
};

export default FeedbackPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const feedback = await FeedbackAPI.getFeedback(token);
  return { props: { title: 'Feedback Submissions', feedback, token } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
