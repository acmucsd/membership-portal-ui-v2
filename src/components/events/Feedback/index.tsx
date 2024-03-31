import { GifSafeImage, Typography } from '@/components/common';
import { config } from '@/lib';
import { FeedbackAPI } from '@/lib/api';
import { PublicFeedback } from '@/lib/types/apiResponses';
import { FeedbackStatus, FeedbackType } from '@/lib/types/enums';
import { formatDate, getProfilePicture, reportError } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { BsCheck, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import styles from './style.module.scss';

export const feedbackTypeNames: Record<FeedbackType, string> = {
  GENERAL: 'ACM',
  MERCH_STORE: 'Store',
  BIT_BYTE: 'Bit-Byte Program',
  AI: 'ACM AI',
  CYBER: 'ACM Cyber',
  DESIGN: 'ACM Design',
  HACK: 'ACM Hack',
  INNOVATE: 'ACM Innovate',
};

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

  let badge;
  if (status === FeedbackStatus.SUBMITTED) {
    badge = (
      <div className={styles.status}>
        <BsCheck aria-hidden />
        Received
      </div>
    );
  } else if (status === FeedbackStatus.ACKNOWLEDGED) {
    badge = (
      <div className={`${styles.status} ${styles.acknowledged}`}>
        <BsEyeFill aria-hidden />
        Acknowledged
      </div>
    );
  } else {
    badge = (
      <div className={`${styles.status} ${styles.ignored}`}>
        <BsEyeSlashFill aria-hidden />
        Ignored
      </div>
    );
  }

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
          <Typography variant="body/medium" component="p">
            {feedback.description}
          </Typography>
          <Typography variant="body/medium" component="p">
            <strong>Where did you hear about this event?</strong> {feedback.source}
          </Typography>
          <Typography variant="body/small" component="p" className={styles.date}>
            <time dateTime={feedback.timestamp}>{formatDate(feedback.timestamp, true)}</time>
            &nbsp;&middot; {feedbackTypeNames[feedback.type]}
          </Typography>
        </div>
        {responseToken !== null && status === FeedbackStatus.SUBMITTED ? (
          <div className={styles.response}>
            <button
              type="button"
              onClick={() => handleStatus(FeedbackStatus.ACKNOWLEDGED)}
              className={`${styles.button} ${styles.acknowledge}`}
            >
              Acknowledge
            </button>
            <button
              type="button"
              onClick={() => handleStatus(FeedbackStatus.IGNORED)}
              className={`${styles.button} ${styles.ignore}`}
            >
              Ignore
            </button>
          </div>
        ) : (
          badge
        )}
      </div>
    </div>
  );
};

export default Feedback;
