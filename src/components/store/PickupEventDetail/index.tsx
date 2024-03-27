import { Typography } from '@/components/common';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { formatEventDate, getDefaultEventCover } from '@/lib/utils';
import Image from 'next/image';
import styles from './style.module.scss';

interface PickupEventDetailProps {
  pickupEvent: PublicOrderPickupEvent;
}

const PickupEventDetail = ({ pickupEvent }: PickupEventDetailProps) => {
  const { linkedEvent, title, start, end, description } = pickupEvent;
  const hasLinkedEvent = linkedEvent !== null;
  const pickupEventCover = getDefaultEventCover(linkedEvent?.cover);

  return (
    <div className={styles.pickupEvent}>
      <div className={styles.image}>
        <Image
          src={pickupEventCover}
          alt="Pickup Event Cover Image"
          style={{ objectFit: 'cover' }}
          fill
        />
      </div>
      <div className={styles.details}>
        <div className={styles.eventInfo}>
          <Typography variant="h2/bold" className={styles.title}>
            {title}
          </Typography>
          <Typography variant="h2/regular" className={styles.title}>
            {formatEventDate(start, end)}
          </Typography>
          {hasLinkedEvent ? (
            <Typography variant="h3/regular">{linkedEvent?.location}</Typography>
          ) : null}
        </div>
        <Typography variant="body/medium">{description}</Typography>
      </div>
    </div>
  );
};

export default PickupEventDetail;
