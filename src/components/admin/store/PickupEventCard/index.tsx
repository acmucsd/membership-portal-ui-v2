import { Typography } from '@/components/common';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { OrderPickupEventStatus } from '@/lib/types/enums';
import { formatEventDate } from '@/lib/utils';
import styles from './style.module.scss';

interface PickupEventCardProps {
  pickupEvent: PublicOrderPickupEvent;
}

const getStatusStyling = (status: OrderPickupEventStatus): string => {
  if (status === OrderPickupEventStatus.ACTIVE) {
    return styles.active;
  }
  if (status === OrderPickupEventStatus.COMPLETED) {
    return styles.completed;
  }
  return styles.cancelled;
};

const PickupEventCard = ({ pickupEvent }: PickupEventCardProps) => {
  const { title, start, end, orders, status } = pickupEvent;

  const statusStyling = getStatusStyling(status);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Typography variant="h5/bold" className={statusStyling}>
          {status}
        </Typography>
        <Typography variant="h5/regular">{`${orders?.length || 0} orders`}</Typography>
      </div>
      <Typography variant="h3/bold" className={styles.title}>
        {title}
      </Typography>
      <Typography variant="h5/regular" suppressHydrationWarning>
        {formatEventDate(start, end, true)}
      </Typography>
    </div>
  );
};

export default PickupEventCard;
