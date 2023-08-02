import styles from './style.module.scss';

const numberFormat = new Intl.NumberFormat('en-US');

interface DiamondsProps {
  count: number;
  className?: string;
}

const Diamonds = ({ count, className }: DiamondsProps) => {
  return (
    <span className={className}>
      {numberFormat.format(count)}
      <span className={styles.diamond} />
    </span>
  );
};

export default Diamonds;
