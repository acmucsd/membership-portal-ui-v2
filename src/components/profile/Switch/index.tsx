import { ReactNode } from 'react';
import styles from './style.module.scss';

interface SwitchProps {
  checked: boolean;
  // eslint-disable-next-line no-unused-vars
  onCheck: (checked: boolean) => void;
  children: ReactNode;
}

const Switch = ({ checked, onCheck, children }: SwitchProps) => {
  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={e => onCheck(e.currentTarget.checked)}
      />
      <span className={styles.switch} /> {children}
    </label>
  );
};

export default Switch;
