import { CommunityLogo, Typography } from '@/components/common';
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
}

const EventDetail = ({ event, attended }: EventDetailProps) => {
  const { cover, title, start, end, location, committee, description } = isOrderPickupEvent(event)
    ? {
        ...(event.linkedEvent ?? {}),
        ...event,
      }
    : event;

  const displayCover = getDefaultEventCover(cover);
  const isUpcomingEvent = new Date(start) > new Date();

  return (
    <>
      <div className={styles.image}>
        <button type="submit" aria-label="Close" className={styles.close}>
          <CloseIcon aria-hidden className={styles.closeIcon} />
        </button>
        <Image src={displayCover} alt="Event Cover Image" style={{ objectFit: 'cover' }} fill />
      </div>
      <div className={styles.contents}>
        <div className={styles.header}>
          <div className={styles.eventDetails}>
            <CommunityLogo community={committee ?? 'General'} size={140} />
            <div>
              <Typography
                className={styles.eventTitle}
                variant="title/large"
                style={{ fontWeight: 700 }}
              >
                {title}
              </Typography>
              <Typography
                className={styles.eventInfo}
                variant="title/small"
                suppressHydrationWarning
              >
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

        <Typography variant="body/medium" style={{ wordBreak: 'break-word' }}>
          {description}
        </Typography>
      </div>
    </>
  );
};

export default EventDetail;
