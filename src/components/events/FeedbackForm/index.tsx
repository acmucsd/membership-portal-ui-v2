import { Typography } from '@/components/common';
import { showToast } from '@/lib';
import { FeedbackAPI } from '@/lib/api';
import { PublicEvent } from '@/lib/types/apiResponses';
import { Community, FeedbackType } from '@/lib/types/enums';
import { reportError, toCommunity } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';

export const communityToFeedbackType: Record<Community, FeedbackType> = {
  [Community.HACK]: FeedbackType.HACK,
  [Community.AI]: FeedbackType.AI,
  [Community.CYBER]: FeedbackType.CYBER,
  [Community.DESIGN]: FeedbackType.DESIGN,
  [Community.GENERAL]: FeedbackType.GENERAL,
};

interface FeedbackFormProps {
  authToken: string;
  event: PublicEvent;
}

const FeedbackForm = ({ authToken, event }: FeedbackFormProps) => {
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={async e => {
        e.preventDefault();
        try {
          await FeedbackAPI.addFeedback(authToken, {
            event: event.uuid,
            source: source,
            description: description.padEnd(20, ' '),
            type: communityToFeedbackType[toCommunity(event.committee)],
          });
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
        aria-label="Feedback source"
        placeholder="Source"
        value={source}
        onChange={e => setSource(e.currentTarget.value)}
        className={styles.field}
      />
      <textarea
        aria-label="Feedback description"
        placeholder="The Hack School event had informational slides that taught more niche than usual so I learned a lot. It was difficult to find the room though. Maybe put up a sign next time."
        value={description}
        onChange={e => setDescription(e.currentTarget.value)}
        className={styles.field}
      />
      <button type="submit" className={styles.submit}>
        Submit
      </button>
    </form>
  );
};

export default FeedbackForm;
