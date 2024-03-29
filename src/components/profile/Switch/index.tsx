import { ReactNode } from 'react';
import styles from './style.module.scss';

interface SwitchProps {
  checked: boolean;
  onCheck: (checked: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

const Switch = ({ checked, onCheck, disabled, children }: SwitchProps) => {
  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={e => onCheck(e.currentTarget.checked)}
        disabled={disabled}
      />
      <span className={styles.switch} /> <span>{children}</span>
    </label>
  );
};

export default Switch;
