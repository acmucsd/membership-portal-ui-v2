import { Typography } from '@/components/common';
import EventBadges from '@/components/events/EventBadges';
import EventModal from '@/components/events/EventModal';
import PickupEventPreviewModal from '@/components/store/PickupEventPreviewModal';
import { config } from '@/lib';
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
import Link from 'next/link';
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
  const { uuid, cover, title, start, end, location, committee } = isOrderPickupEvent(event)
    ? {
        ...(event.linkedEvent ?? {}),
        ...event,
      }
    : event;
  const community = toCommunity(committee);

  const [expanded, setExpanded] = useState(false);
  const isPickupEvent = isOrderPickupEvent(event);

  const displayCover = getDefaultEventCover(cover);

  return (
    <>
      {isPickupEvent ? (
        <PickupEventPreviewModal
          pickupEvent={event as PublicOrderPickupEvent}
          open={expanded}
          onClose={() => setExpanded(false)}
          futurePickupEvents={[]}
        />
      ) : (
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

      <Link
        href={`${config.eventsRoute}/${uuid}`}
        data-community={community}
        className={`${styles.container} ${borderless ? '' : styles.bordered} ${className || ''}`}
        onClick={e => {
          e.preventDefault();
          setExpanded(true);
        }}
      >
        <div className={styles.image}>
          <Image
            src={displayCover}
            alt={`${event.title} cover image`}
            style={{ objectFit: 'cover' }}
            sizes="20rem"
            fill
          />
        </div>
        {!hideInfo ? (
          <div className={styles.info}>
            <div className={styles.infoText}>
              <Typography
                variant="body/small"
                style={{
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
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
            </div>
            <EventBadges event={event} attended={attended} />
          </div>
        ) : null}
      </Link>
    </>
  );
};

export default EventCard;
