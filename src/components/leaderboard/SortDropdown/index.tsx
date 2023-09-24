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
  // Justification for disabling rules: This seems to be a false positive.
  // https://stackoverflow.com/q/63767199/
  // eslint-disable-next-line no-unused-vars
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
    <div
      className={styles.dropdownWrapper}
      aria-label={ariaLabel}
      onClick={e => {
        // Using the keyboard to select an option fires the click event on
        // <select>; prevent it from opening the fake dropdown. The <select> has
        // pointer-events: none so it shouldn't receive the click event any
        // other way.
        if (e.target instanceof HTMLElement && e.target.tagName === 'SELECT') {
          return;
        }
        setOpen(true);
      }}
    >
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
