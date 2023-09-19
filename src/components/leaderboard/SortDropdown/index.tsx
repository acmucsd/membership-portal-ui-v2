import DropdownArrow from '@/public/assets/icons/dropdown-arrows.svg';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  name: string;
  ariaLabel: string;
  options: (SortOption | '---')[];
  value: string;
  onChange: (value: string) => void;
}

const SortDropdown = ({ name, ariaLabel, options, value, onChange }: SortDropdownProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener('click', event => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(`.${styles.dropdownWrapper}`)
      ) {
        return;
      }
      setOpen(false);
    });
  }, [open]);

  return (
    // Justification for disabling rules: For accessibility reasons, the
    // original <select> should be available for keyboard and screen reader
    // users. Only the fancy, inaccessible dropdown should be available for
    // mouse/touch users.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.dropdownWrapper} aria-label={ariaLabel} onClick={() => setOpen(true)}>
      <select name={name} id={name} value={value} onChange={e => onChange(e.currentTarget.value)}>
        {options.map(option =>
          option !== '---' ? (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ) : null
        )}
      </select>
      <DropdownArrow />
      <div className={`${styles.contents} ${open ? '' : styles.closed}`}>
        {options.map((option, i) =>
          option !== '---' ? (
            <button
              type="button"
              className={styles.option}
              onClick={event => {
                onChange(option.value);
                setOpen(false);
                event.stopPropagation();
              }}
              key={option.value}
            >
              {option.label}
            </button>
          ) : (
            // Justification for disabling rule: This is to allow multiple
            // dividers.
            // eslint-disable-next-line react/no-array-index-key
            <hr key={i} />
          )
        )}
      </div>
    </div>
  );
};

export default SortDropdown;
