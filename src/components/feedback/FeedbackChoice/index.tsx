import { Typography } from '@/components/common';
import { useId, useState } from 'react';
import styles from './style.module.scss';

interface FeedbackChoiceProps {
  question: string;
  choices: string[];
  singleChoice?: boolean;
  onExport: (choices: string) => void;
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
      (selected.length > 0 ? `${selected.join(', ')}\n` : '') +
        (other.length > 0 ? `${other}\n` : '')
    );
  };

  return (
    <div className={styles.wrapper}>
      <Typography variant="body/medium" component="p">
        <strong>{question}</strong> {singleChoice ? 'Choose one.' : 'Select all that apply.'}
        {singleChoice && selected.length > 0 ? (
          <button type="button" onClick={() => handleSelection([])}>
            Clear selection
          </button>
        ) : null}
      </Typography>
      {choices.map((choice, i) => (
        <label key={choice}>
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
          &nbsp;
          {choice}
        </label>
      ))}
      {singleChoice ? null : (
        <label>
          Other:&nbsp;
          <textarea
            value={other}
            onChange={e => handleSelection(selected, e.currentTarget.value)}
          />
        </label>
      )}
    </div>
  );
};

export default FeedbackChoice;
