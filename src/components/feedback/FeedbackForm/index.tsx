import { Typography } from '@/components/common';
import FeedbackChoice from '@/components/feedback/FeedbackChoice';
import { showToast } from '@/lib';
import { FeedbackAPI } from '@/lib/api';
import { PublicEvent, PublicFeedback } from '@/lib/types/apiResponses';
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
  attended: boolean;
  onSubmit?: (feedback: PublicFeedback) => void;
}

const FeedbackForm = ({ authToken, event, attended, onSubmit }: FeedbackFormProps) => {
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={async e => {
        e.preventDefault();
        try {
          const feedback = await FeedbackAPI.addFeedback(authToken, {
            event: event.uuid,
            source: source,
            description,
            type: communityToFeedbackType[toCommunity(event.committee)],
          });
          showToast(
            'Feedback received!',
            'Thank you for taking the time to help us make our events better for you.'
          );
          onSubmit?.(feedback);
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
      <textarea
        aria-label="Feedback description"
        placeholder="The Hack School event had informational slides that taught more niche than usual so I learned a lot."
        value={description}
        onChange={e => setDescription(e.currentTarget.value)}
        className={styles.field}
      />
      <p>
        Answer as few of the following optional questions as you want. You can elaborate on your
        responses above.
      </p>
      <FeedbackChoice
        question="How did you hear about this event?"
        choices={[
          'Instagram',
          'Discord',
          'ACM website',
          'Flyer or tabling',
          'A friend/word of mouth',
          'Just passing by',
        ]}
        onExport={setSource}
      />
      {attended ? (
        <FeedbackChoice
          question="How easy was it to find the event?"
          choices={[
            'I was already familiar with the event location.',
            "I didn't know where it was, but it was easy to figure out myself.",
            'It was a bit difficult to find the event location.',
          ]}
          singleChoice
          onExport={console.log}
        />
      ) : (
        <FeedbackChoice
          question="Why weren't you able to make it to the event?"
          choices={[
            'Forgot to check in',
            'Busy with classes',
            'Conflict with another class or event',
            'Forgot that the event was happening',
            'Already made plans for something else today',
            "Couldn't find the room",
          ]}
          onExport={console.log}
        />
      )}
      <button type="submit" className={styles.submit}>
        Submit
      </button>
    </form>
  );
};

export default FeedbackForm;
