import { useEffect, useId, useState } from 'react';
import styles from './style.module.scss';

const SizeSelector = () => {
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState('S' || 'M' || 'L' || 'XL');

  const smallId = `small${useId()}`;
  const mediumId = `medium${useId()}`;
  const largeId = `large${useId()}`;
  const xlId = `XL${useId()}`;

  const sizeToStyle: Record<string, string> = {
    S: styles.smallOn,
    M: styles.medOn,
    L: styles.lOn,
    XL: styles.xlOn,
  };

  // NEED TO CHANGE ACTUAL LABEL, NOT SOME EXTERNAL DIV. CAN'T USE + B/C OF ODD LINTING ERRORS

  const iconSize = 30;

  const currAltText = `TODO`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <form className={styles.switch}>
      <input
        id={smallId}
        name="state-d"
        type="radio"
        defaultChecked={size === 'S'}
        onClick={() => setSize('S')}
      />
      <label htmlFor={smallId}>{/* SMALL */}</label>

      <input
        id={mediumId}
        name="state-d"
        type="radio"
        defaultChecked={size === 'M'}
        onClick={() => setSize('M')}
      />
      <label htmlFor={mediumId}>{/* MEDIUM */}</label>

      <input
        id={largeId}
        name="state-d"
        type="radio"
        defaultChecked={size === 'L'}
        onClick={() => setSize('L')}
      />
      <label htmlFor={largeId}>{/* LARGE */}</label>

      <input
        id={xlId}
        name="state-d"
        type="radio"
        defaultChecked={size === 'XL'}
        onClick={() => setSize('XL')}
      />
      <label htmlFor={xlId}>{/* XL */}</label>
    </form>
  );
};
export default SizeSelector;

// Links for knowledge:
// https://medium.com/@vincent.bocquet/typescript-with-react-usestate-hook-f701309384a
