import { CommunityLogo, Typography } from '@/components/common';
import EventModal from '@/components/events/EventModal';
import PointsDisplay from '@/components/events/PointsDisplay';
import {
  PublicEvent,
  PublicOrderPickupEvent,
  PublicOrderPickupEventWithLinkedEvent,
} from '@/lib/types/apiResponses';
import { formatEventDate, isOrderPickupEvent } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import styles from './style.module.scss';

interface EventCardProps {
  event: PublicEvent | PublicOrderPickupEvent;
  attended: boolean;
  className?: string;
  showYear?: boolean;
  borderless?: boolean;
}

const EventCard = ({ event, attended, className, showYear, borderless }: EventCardProps) => {
  const { cover, title, start, end, location, committee } = isOrderPickupEvent(event)
    ? {
        ...(event.linkedEvent ?? {}),
        ...event,
      }
    : event;

  const [expanded, setExpanded] = useState(false);
  const hasModal = !isOrderPickupEvent(event) || event.linkedEvent;

  const displayCover = cover || '/assets/graphics/store/hero-photo.jpg';

  return (
    <>
      {hasModal && (
        <EventModal
          open={expanded}
          attended={attended}
          event={
            isOrderPickupEvent(event)
              ? (event as PublicOrderPickupEventWithLinkedEvent).linkedEvent
              : event
          }
          onClose={() => setExpanded(false)}
        />
      )}

      <button
        type="button"
        className={`${styles.container} ${borderless ? '' : styles.bordered} ${className || ''}`}
        onClick={() => setExpanded(true)}
        disabled={!hasModal}
      >
        <div className={styles.image}>
          {!isOrderPickupEvent(event) && (
            <PointsDisplay points={event.pointValue} attended={attended} />
          )}
          <Image
            src={displayCover}
            alt="Event Cover Image"
            style={{ objectFit: 'cover' }}
            sizes="20rem"
            fill
          />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <CommunityLogo community={committee ?? 'General'} size={50} />
            <div className={styles.eventDetails}>
              <Typography
                variant="body/medium"
                style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {title}
              </Typography>
              <Typography
                variant="body/small"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                suppressHydrationWarning
              >
                {formatEventDate(start, end, showYear)}
              </Typography>
              <Typography
                variant="body/small"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {location}
              </Typography>
            </div>
          </div>
        </div>
      </button>
    </>
  );
};

export default EventCard;
