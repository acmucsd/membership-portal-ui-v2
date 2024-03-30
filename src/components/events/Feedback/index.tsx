import { GifSafeImage, Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicFeedback } from '@/lib/types/apiResponses';
import { formatDate, getProfilePicture } from '@/lib/utils';
import Link from 'next/link';
import styles from './style.module.scss';

interface FeedbackProps {
  feedback: PublicFeedback;
  adminView: boolean;
}

const Feedback = ({ feedback, adminView }: FeedbackProps) => {
  return (
    <div className={styles.wrapper}>
      {adminView ? (
        <div className={styles.top}>
          <Link href={`${config.userProfileRoute}${feedback.user.handle}`} className={styles.user}>
            <GifSafeImage
              src={getProfilePicture(feedback.user)}
              width={24}
              height={24}
              quality={10}
              alt={`Profile picture for ${feedback.user.firstName} ${feedback.user.lastName}`}
            />
            <span>
              {feedback.user.firstName} {feedback.user.lastName}
            </span>
          </Link>
        </div>
      ) : null}
      <div className={styles.feedback}>
        <Typography variant="h4/bold" component="h2">
          {feedback.title}
        </Typography>
        <Typography variant="body/medium" component="p">
          {feedback.description}
        </Typography>
        <Typography variant="body/small" component="p" className={styles.date}>
          {formatDate(feedback.timestamp, true)}
        </Typography>
      </div>
    </div>
  );
};

export default Feedback;
