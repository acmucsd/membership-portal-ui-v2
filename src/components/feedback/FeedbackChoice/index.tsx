import { Typography } from '@/components/common';
import { useId, useState } from 'react';
import styles from './style.module.scss';

interface FeedbackChoiceProps {
  question: string;
  choices: string[];
  singleChoice?: boolean;
  onExport: (question: string, choices: string) => void;
}

const FeedbackChoice = ({
  question,
  choices,
  singleChoice = false,
  onExport,
}: FeedbackChoiceProps) => {
  const id = useId();
  const [selected, setSelected] = useState<string[]>([]);
  const [other, setOther] = useState<string>('');

  const handleSelection = (selected: string[], other = '') => {
    setSelected(selected);
    setOther(other);
    onExport(
      question,
      (selected.length > 0 ? `${selected.join(', ')}\n` : '') +
        (other.length > 0 ? `Other: ${other}\n` : '')
    );
  };

  return (
    <div className={styles.wrapper}>
      <Typography variant="body/medium" component="p">
        <strong>{question}</strong> {singleChoice ? 'Choose one.' : 'Select all that apply.'}&nbsp;
        {singleChoice && selected.length > 0 ? (
          <button
            type="button"
            onClick={() => handleSelection([])}
            className={styles.clearSelection}
          >
            Clear selection
          </button>
        ) : null}
      </Typography>
      {choices.map((choice, i) => (
        <label className={styles.response} key={choice}>
          <input
            type={singleChoice ? 'radio' : 'checkbox'}
            name={singleChoice ? id : `${id}_${i}`}
            checked={selected.includes(choice)}
            onChange={() => {
              if (singleChoice) {
                handleSelection([choice]);
              } else {
                handleSelection(
                  selected.includes(choice)
                    ? selected.filter(c => c !== choice)
                    : [...selected, choice],
                  other
                );
              }
            }}
          />
          <div className={styles.indicator}> </div>
          {choice}
        </label>
      ))}
      {singleChoice ? null : (
        <label className={styles.other}>
          Other:&nbsp;
          <input
            type="text"
            value={other}
            onChange={e => handleSelection(selected, e.currentTarget.value)}
            className={styles.otherField}
          />
        </label>
      )}
    </div>
  );
};

export default FeedbackChoice;
