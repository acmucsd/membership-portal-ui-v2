import styles from './style.module.scss';

const numberFormat = new Intl.NumberFormat('en-US');
const compactFormat = new Intl.NumberFormat('en-US', { notation: 'compact' });

interface DiamondsProps {
  count: number;
  discount?: number;
  className?: string;
}

const Diamonds = ({ count, discount, className }: DiamondsProps) => {
  const discountActive = discount !== undefined && discount < count;
  return (
    <span className={className}>
      <span className={className} style={discountActive ? { textDecoration: 'line-through' } : {}}>
        {(count >= 1e5 ? compactFormat : numberFormat).format(count)}
      </span>
      {discountActive && (
        <span className={className} style={{ color: 'var(--theme-danger-1)' }}>
          {' '}
          {(discount >= 1e5 ? compactFormat : numberFormat).format(discount)}
        </span>
      )}
      <span className={styles.diamond}>diamonds</span>
    </span>
  );
};

export default Diamonds;
