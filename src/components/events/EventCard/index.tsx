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
import { ComponentType, Fragment, ReactNode, useState } from 'react';
import styles from './style.module.scss';

interface EventCardProps {
  event: PublicEvent | PublicOrderPickupEvent;
  attended: boolean;
  className?: string;
  showYear?: boolean;
  borderless?: boolean;
  hideInfo?: boolean;
  interactive?: boolean;
  /** Used by onboarding to highlight the badges */
  badgeWrapper?: ComponentType<{ children: ReactNode }>;
}

const EventCard = ({
  event,
  attended,
  className,
  showYear,
  borderless,
  hideInfo,
  interactive = true,
  badgeWrapper: BadgeWrapper = Fragment,
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

  const Component = interactive ? Link : 'div';

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

      <Component
        href={`${config.eventsRoute}/${uuid}`}
        data-community={community}
        data-disabled={borderless}
        className={`${styles.container} ${borderless ? '' : styles.bordered} ${className || ''} ${
          interactive ? styles.interactive : ''
        }`}
        onClick={e => {
          if (!interactive) {
            return;
          }
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
            <BadgeWrapper>
              <EventBadges event={event} attended={attended} />
            </BadgeWrapper>
          </div>
        ) : null}
      </Component>
    </>
  );
};

export default EventCard;
