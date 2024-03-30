import { GifSafeImage, Typography } from '@/components/common';
import { feedbackTypeNames } from '@/components/events/FeedbackForm';
import { config } from '@/lib';
import { FeedbackAPI } from '@/lib/api';
import { PublicFeedback } from '@/lib/types/apiResponses';
import { FeedbackStatus } from '@/lib/types/enums';
import { formatDate, getProfilePicture, reportError } from '@/lib/utils';
import Link from 'next/link';
import { useId, useState } from 'react';
import { BsCheck, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import styles from './style.module.scss';

interface FeedbackProps {
  feedback: PublicFeedback;
  showUser?: boolean;
  /**
   * Auth token. Provide it only if the user has permission to respond to
   * feedback (i.e. they're an admin)
   */
  responseToken?: string | null;
}

const Feedback = ({ feedback, showUser = false, responseToken = null }: FeedbackProps) => {
  const [status, setStatus] = useState(feedback.status);
  const id = useId();

  const handleStatus = async (newStatus: FeedbackStatus) => {
    if (!responseToken) {
      return;
    }
    setStatus(newStatus);
    try {
      await FeedbackAPI.respondToFeedback(responseToken, feedback.uuid, newStatus);
    } catch (error) {
      reportError('Failed to update feedback status', error);
      // Reset status
      setStatus(status);
    }
  };

  return (
    <div className={styles.wrapper}>
      {showUser ? (
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
      ) : null}
      <div className={styles.body}>
        <div className={styles.feedback}>
          <Typography variant="h4/bold" component="h2">
            {feedback.title}
          </Typography>
          <Typography variant="body/medium" component="p">
            {feedback.description}
          </Typography>
          <Typography variant="body/small" component="p" className={styles.date}>
            {formatDate(feedback.timestamp, true)} &middot; {feedbackTypeNames[feedback.type]}
          </Typography>
        </div>
        <div
          className={`${styles.statuses} ${
            responseToken === null ? styles.userView : styles.adminView
          }`}
        >
          <input
            type="radio"
            name={id}
            id={`${id}-SUBMITTED`}
            value="submitted"
            checked={status === FeedbackStatus.SUBMITTED}
            onClick={() => handleStatus(FeedbackStatus.SUBMITTED)}
            disabled={responseToken === null}
          />
          <label htmlFor={`${id}-SUBMITTED`} className={styles.status}>
            <BsCheck aria-hidden />
            Received
          </label>
          <input
            type="radio"
            name={id}
            id={`${id}-ACKNOWLEDGED`}
            value="submitted"
            checked={status === FeedbackStatus.ACKNOWLEDGED}
            onClick={() => handleStatus(FeedbackStatus.ACKNOWLEDGED)}
            disabled={responseToken === null}
          />
          <label htmlFor={`${id}-ACKNOWLEDGED`} className={styles.status}>
            <BsEyeFill aria-hidden />
            Acknowledged
          </label>
          <input
            type="radio"
            name={id}
            id={`${id}-IGNORED`}
            value="submitted"
            checked={status === FeedbackStatus.IGNORED}
            onClick={() => handleStatus(FeedbackStatus.IGNORED)}
            disabled={responseToken === null}
          />
          <label htmlFor={`${id}-IGNORED`} className={styles.status}>
            <BsEyeSlashFill aria-hidden />
            Ignored
          </label>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
