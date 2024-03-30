import { Dropdown, Typography } from '@/components/common';
import { showToast } from '@/lib';
import { FeedbackAPI } from '@/lib/api';
import { FeedbackType } from '@/lib/types/enums';
import { isEnum, reportError } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';

const feedbackTypeNames: Record<FeedbackType, string> = {
  GENERAL: 'ACM',
  MERCH_STORE: 'Store',
  BIT_BYTE: 'Bit-Byte Program',
  AI: 'ACM AI',
  CYBER: 'ACM Cyber',
  DESIGN: 'ACM Design',
  HACK: 'ACM Hack',
  INNOVATE: 'ACM Innovate',
};

interface FeedbackFormProps {
  authToken: string;
}

const FeedbackForm = ({ authToken }: FeedbackFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(FeedbackType.GENERAL);

  return (
    <form
      className={styles.form}
      onSubmit={async e => {
        e.preventDefault();
        if (title.length === 0) {
          return;
        }
        try {
          await FeedbackAPI.addFeedback(
            authToken,
            title,
            description.padEnd(100, ' '),
            FeedbackType.GENERAL
          );
          showToast(
            'Feedback received!',
            'Thank you for taking the time to help us make our events better for you.'
          );
        } catch (error) {
          reportError('Failed to submit feedback', error);
        }
      }}
    >
      <Typography variant="h2/bold" component="h2">
        Feedback
      </Typography>
      <p>
        Feel free to give event suggestions, friendly words, constructive crisitism, or just say
        what’s on your mind!
      </p>
      <input
        aria-label="Feedback title"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.currentTarget.value)}
        className={styles.field}
      />
      <textarea
        aria-label="Feedback description"
        placeholder="The Hack School event had informational slides that taught more niche than usual so I learned a lot. It was difficult to find the room though. Maybe put up a sign next time."
        value={description}
        onChange={e => setDescription(e.currentTarget.value)}
        className={styles.field}
      />
      <Dropdown
        name="feedback-type"
        ariaLabel="Feedback target"
        options={Object.entries(feedbackTypeNames).map(([value, label]) => ({ value, label }))}
        value={type}
        onChange={type => {
          if (isEnum(FeedbackType, type)) {
            setType(type);
          }
        }}
        className={styles.field}
      />
      {title.length > 0 ? (
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      ) : null}
    </form>
  );
};

export default FeedbackForm;
