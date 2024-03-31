import { Typography, type Variant } from '@/components/common';
import { config } from '@/lib';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { OrderPickupEventStatus } from '@/lib/types/enums';
import { formatEventDate } from '@/lib/utils';
import Link from 'next/link';
import styles from './style.module.scss';

interface PickupEventStatusProps {
  status: OrderPickupEventStatus;
  variant: Variant;
}

export const PickupEventStatus = ({ status, variant }: PickupEventStatusProps) => {
  let statusStyling = styles.cancelled;
  if (status === OrderPickupEventStatus.ACTIVE) {
    statusStyling = styles.active;
  }
  if (status === OrderPickupEventStatus.COMPLETED) {
    statusStyling = styles.completed;
  }
  return (
    <Typography variant={variant} className={statusStyling}>
      {status}
    </Typography>
  );
};

interface PickupEventCardProps {
  pickupEvent: PublicOrderPickupEvent;
}

const PickupEventCard = ({ pickupEvent }: PickupEventCardProps) => {
  const { title, start, end, orders, status, uuid } = pickupEvent;

  return (
    <Link className={styles.card} href={`${config.admin.store.pickup}/${uuid}`}>
      <div className={styles.header}>
        <PickupEventStatus status={status} variant="h5/bold" />
        <Typography variant="h5/regular">{`${orders?.length || 0} orders`}</Typography>
      </div>
      <Typography variant="h3/bold" className={styles.title}>
        {title}
      </Typography>
      <Typography variant="h5/regular" suppressHydrationWarning>
        {formatEventDate(start, end, true)}
      </Typography>
      {/* <button
        type="button"
        className={`${styles.displayButton}`}
        onClick={() => cancelPickupEvent(uuid, token)}
      >
        <Typography variant="h5/bold">Complete Pickup Event</Typography>
      </button> */}
    </Link>
  );
};

export default PickupEventCard;
