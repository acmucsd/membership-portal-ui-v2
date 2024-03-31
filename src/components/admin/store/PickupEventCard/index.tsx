import {
  cancelPickupEvent,
  completePickupEvent,
} from '@/components/admin/event/AdminPickupEvent/AdminPickupEventForm';
import { Typography, type Variant } from '@/components/common';
import { config } from '@/lib';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { OrderPickupEventStatus } from '@/lib/types/enums';
import { formatEventDate } from '@/lib/utils';
import { Button } from '@mui/material';
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
  token: string;
}

const PickupEventCard = ({ pickupEvent, token }: PickupEventCardProps) => {
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
      <Button
        type="button"
        className={`${styles.displayButton}`}
        onClick={() => completePickupEvent(uuid, token)}
      >
        <Typography variant="h5/bold">Complete Pickup Event</Typography>
      </Button>
      <Button
        type="button"
        className={`${styles.displayButton}`}
        onClick={() => {
          cancelPickupEvent(uuid, token);
        }}
      >
        <Typography variant="h5/bold">Cancel Pickup Event</Typography>
      </Button>
    </Link>
  );
};

export default PickupEventCard;
