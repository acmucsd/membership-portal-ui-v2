import { Typography } from '@/components/common';
import EventModal from '@/components/events/EventModal';
import { communityNames } from '@/lib/constants/communities';
import {
  PublicEvent,
  PublicOrderPickupEvent,
  PublicOrderPickupEventWithLinkedEvent,
} from '@/lib/types/apiResponses';
import {
  formatEventDate,
  getDefaultEventCover,
  isOrderPickupEvent,
  toCommunity,
} from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import styles from './style.module.scss';

interface EventCardProps {
  event: PublicEvent | PublicOrderPickupEvent;
  attended: boolean;
  className?: string;
  showYear?: boolean;
  borderless?: boolean;
  hideInfo?: boolean;
}

const EventCard = ({
  event,
  attended,
  className,
  showYear,
  borderless,
  hideInfo,
}: EventCardProps) => {
  const { cover, title, start, end, location, committee } = isOrderPickupEvent(event)
    ? {
        ...(event.linkedEvent ?? {}),
        ...event,
      }
    : event;
  const community = toCommunity(committee);

  const [expanded, setExpanded] = useState(false);
  const hasModal = !isOrderPickupEvent(event) || event.linkedEvent;

  const displayCover = getDefaultEventCover(cover);

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
          <Image
            src={displayCover}
            alt="Event Cover Image"
            style={{ objectFit: 'cover' }}
            sizes="20rem"
            fill
          />
        </div>
        {!hideInfo && (
          <div className={styles.info}>
            <Typography
              variant="body/small"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              suppressHydrationWarning
            >
              {formatEventDate(start, end, showYear)}
            </Typography>
            <Typography
              variant="body/medium"
              style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {title}
            </Typography>
            <Typography
              variant="body/small"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {location}
            </Typography>
            <div className={styles.badges}>
              <div className={`${styles.badge} ${styles[`badge${community}`]}`}>
                {communityNames[community]}
              </div>
              {!isOrderPickupEvent(event) && (
                <div className={`${styles.badge} ${styles.badgePoints}`}>
                  {event.pointValue} point{event.pointValue === 1 ? '' : 's'}
                </div>
              )}
              {!isOrderPickupEvent(event) && attended && (
                <div className={`${styles.badge} ${styles.badgeAttended}`}>Attended</div>
              )}
            </div>
          </div>
        )}
      </button>
    </>
  );
};

export default EventCard;
