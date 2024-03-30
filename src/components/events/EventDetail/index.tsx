import { Typography } from '@/components/common';
import CalendarButtons from '@/components/events/CalendarButtons';
import EventBadges from '@/components/events/EventBadges';
import { PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { formatEventDate, getDefaultEventCover, isOrderPickupEvent } from '@/lib/utils';
import CloseIcon from '@/public/assets/icons/close-icon.svg';
import Image from 'next/image';
import styles from './style.module.scss';

interface EventDetailProps {
  event: PublicEvent | PublicOrderPickupEvent;
  attended: boolean;
  showCloseBtn?: boolean;
}

const EventDetail = ({ event, attended, showCloseBtn = false }: EventDetailProps) => {
  const { cover, title, start, end, location, description } = isOrderPickupEvent(event)
    ? {
        ...(event.linkedEvent ?? {}),
        ...event,
      }
    : event;

  const displayCover = getDefaultEventCover(cover);
  const isUpcomingEvent = new Date(start) > new Date();

  return (
    <div className={styles.container}>
      {showCloseBtn ? (
        <button type="submit" aria-label="Close" className={styles.close}>
          <CloseIcon aria-hidden className={styles.closeIcon} />
        </button>
      ) : null}
      <div className={styles.image}>
        <Image src={displayCover} alt="Event Cover Image" style={{ objectFit: 'cover' }} fill />
      </div>
      <div className={styles.header}>
        <div className={styles.eventDetails}>
          <div>
            <Typography
              className={styles.eventTitle}
              variant="title/large"
              style={{ fontWeight: 700 }}
            >
              {title}
            </Typography>
            <Typography className={styles.eventInfo} variant="title/small" suppressHydrationWarning>
              {formatEventDate(start, end, true)}
            </Typography>
            <Typography className={styles.eventInfo} variant="title/small">
              {location}
            </Typography>
            <EventBadges className={styles.badges} event={event} attended={attended} />
          </div>
        </div>

        {isUpcomingEvent && !isOrderPickupEvent(event) ? <CalendarButtons event={event} /> : null}
      </div>

      <Typography
        variant="h5/regular"
        style={{ wordBreak: 'break-word' }}
        className={styles.description}
      >
        {description}
      </Typography>
    </div>
  );
};

export default EventDetail;
