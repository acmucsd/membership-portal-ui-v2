import { Typography } from '@/components/common';
import Feedback from '@/components/events/Feedback';
import { FeedbackAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicFeedback } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/feedback.module.scss';
import type { GetServerSideProps } from 'next';

interface FeedbackPageProps {
  feedback: PublicFeedback[];
}
const FeedbackPage = ({ feedback }: FeedbackPageProps) => {
  return (
    <div className={styles.page}>
      <Typography variant="h2/bold" component="h1">
        Feedback Submissions
      </Typography>
      {feedback.map(feedback => (
        <Feedback key={feedback.uuid} feedback={feedback} adminView />
      ))}
    </div>
  );
};

export default FeedbackPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const feedback = await FeedbackAPI.getFeedback(token);
  return { props: { feedback } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
