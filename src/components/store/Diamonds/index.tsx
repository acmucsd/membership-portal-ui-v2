import styles from './style.module.scss';

const numberFormat = new Intl.NumberFormat('en-US');

interface DiamondsProps {
  count: number;
  className?: string;
}

const Diamonds = ({ count, className }: DiamondsProps) => (
  <span className={className}>
    {numberFormat.format(count)} <span className={styles.diamond}>diamonds</span>
  </span>
);

export default Diamonds;
