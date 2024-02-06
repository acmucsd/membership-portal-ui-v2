import { Typography } from '@/components/common';
import RightArrowIcon from '@/public/assets/icons/page-right-icon.svg';
import styles from './styles.module.scss';

interface ModalCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

const ModalCard = ({ title, subtitle, onClick }: ModalCardProps) => {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <Typography className={styles.cardHeader} variant="title/medium" style={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography className={styles.cardBody} variant="h5/regular">
        {subtitle}
      </Typography>
      {/* Circle with arrow on the bottom right of the card */}
      <div className={styles.cardFooter}>
        <RightArrowIcon className={styles.circle} />
      </div>
    </button>
  );
};

export default ModalCard;
