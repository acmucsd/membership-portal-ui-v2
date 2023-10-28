import styles from './style.module.scss';

const numberFormat = new Intl.NumberFormat('en-US');
const compactFormat = new Intl.NumberFormat('en-US', { notation: 'compact' });

interface DiamondsProps {
  count: number;
  className?: string;
}

const Diamonds = ({ count, className }: DiamondsProps) => (
  <span className={className}>
    {(count >= 1e6 ? compactFormat : numberFormat).format(count)}{' '}
    <span className={styles.diamond}>diamonds</span>
  </span>
);

export default Diamonds;
