import { BsEyeSlash } from 'react-icons/bs';
import styles from './style.module.scss';

interface HiddenIconProps {
  type: 'item' | 'collection';
}

const HiddenIcon = ({ type }: HiddenIconProps) => {
  const label = type === 'collection' ? 'Archived collection' : 'Hidden item';
  return <BsEyeSlash className={styles.icon} title={label} aria-label={label} />;
};

export default HiddenIcon;
