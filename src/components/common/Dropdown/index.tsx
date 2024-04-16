import DropdownArrow from '@/public/assets/icons/dropdown-arrows.svg';
import { ReactNode, useEffect, useState } from 'react';
import styles from './style.module.scss';

interface Option {
  value: string;
  label: string;
}

export const DIVIDER = '----';

interface DropdownProps {
  name: string;
  ariaLabel: string;
  options: (Option | typeof DIVIDER)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Dropdown = ({ name, ariaLabel, options, value, onChange, className }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest(`.${styles.dropdownWrapper}`)) {
        return;
      }
      setOpen(false);
    });
  }, [open]);

  const optionButtons: ReactNode[] = [];
  let dividers = 0;
  options.forEach(option => {
    if (option === DIVIDER) {
      optionButtons.push(<hr key={dividers} />);
      dividers += 1;
    } else {
      optionButtons.push(
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
      );
    }
  });

  return (
    // Justification for disabling rules: For accessibility reasons, the
    // original <select> should be available for keyboard and screen reader
    // users. Only the fancy, inaccessible dropdown should be available for
    // mouse/touch users.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`${styles.dropdownWrapper} ${className}`}
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
      <select
        name={name}
        id={name}
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        aria-label={ariaLabel}
      >
        {options.map(option =>
          option !== DIVIDER ? (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ) : null
        )}
      </select>
      <DropdownArrow className={styles.arrow} aria-hidden />
      <div className={`${styles.contents} ${open ? '' : styles.closed}`}>{optionButtons}</div>
    </div>
  );
};

export default Dropdown;
