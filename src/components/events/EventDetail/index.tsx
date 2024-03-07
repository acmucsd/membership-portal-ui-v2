import { CommunityLogo, Typography } from '@/components/common';
import CalendarButtons from '@/components/events/CalendarButtons';
import PointsDisplay from '@/components/events/PointsDisplay';
import { PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { fixUrl, formatEventDate, isOrderPickupEvent } from '@/lib/utils';
import CloseIcon from '@/public/assets/icons/close-icon.svg';
import LinkIcon from '@/public/assets/icons/link.svg';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface EventDetailProps {
  event: PublicEvent | PublicOrderPickupEvent;
  attended: boolean;
  /** controls whether a close button is shown */
  inModal?: boolean;
}

const EventDetail = ({ event, attended, inModal = true }: EventDetailProps) => {
  const { cover, title, start, end, location, committee, pointValue, eventLink, description } =
    isOrderPickupEvent(event)
      ? {
          ...(event.linkedEvent ?? {}),
          ...event,
        }
      : event;

  const displayCover = cover || '/assets/graphics/store/hero-photo.jpg';
  const uuidForLink = isOrderPickupEvent(event) ? event.linkedEvent?.uuid : event.uuid;
  const displayEventLink =
    fixUrl(eventLink ?? '') || (uuidForLink && `https://acmucsd.com/events/${uuidForLink}`) || '';
  const isUpcomingEvent = new Date(start) > new Date();

  return (
    <>
      <div className={styles.image}>
        {inModal && (
          <button type="submit" aria-label="Close" className={styles.close}>
            <CloseIcon aria-hidden className={styles.closeIcon} />
          </button>
        )}
        {pointValue && <PointsDisplay points={pointValue} attended={attended} />}
        <Image src={displayCover} alt="Event Cover Image" style={{ objectFit: 'cover' }} fill />
      </div>
      <div className={styles.contents}>
        <div className={styles.header}>
          <div className={styles.eventDetails}>
            <CommunityLogo community={committee ?? 'General'} size={100} />
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
                variant="title/medium"
                suppressHydrationWarning
              >
                {formatEventDate(start, end, true)}
              </Typography>
              <Typography className={styles.eventInfo} variant="title/medium">
                {location}
              </Typography>
            </div>
          </div>

          {isUpcomingEvent && !isOrderPickupEvent(event) ? <CalendarButtons event={event} /> : null}
        </div>

        <Typography variant="body/medium" style={{ wordBreak: 'break-word' }}>
          {description}
        </Typography>
        {displayEventLink && (
          <Link className={styles.link} href={displayEventLink}>
            <div style={{ width: 11 }}>
              <LinkIcon aria-hidden />
            </div>
            <Typography
              variant="body/medium"
              style={{ color: 'var(--theme-primary-2)', wordBreak: 'break-all' }}
            >
              {displayEventLink}
            </Typography>
          </Link>
        )}
      </div>
    </>
  );
};

export default EventDetail;
