import { CommunityLogo, Modal, Typography } from '@/components/common';
import CalendarButtons from '@/components/events/CalendarButtons';
import PointsDisplay from '@/components/events/PointsDisplay';
import { PublicEvent } from '@/lib/types/apiResponses';
import { fixUrl, formatEventDate } from '@/lib/utils';
import CloseIcon from '@/public/assets/icons/close-icon.svg';
import LinkIcon from '@/public/assets/icons/link.svg';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface EventModalProps {
  open: boolean;
  attended: boolean;
  event: PublicEvent;
  onClose: () => void;
}

const EventModal = ({ open, attended, event, onClose }: EventModalProps) => {
  const { cover, title, start, end, location, description, eventLink } = event;

  const displayCover = cover || '/assets/graphics/store/hero-photo.jpg';
  const displayEventLink = fixUrl(eventLink) || `https://acmucsd.com/events/${event.uuid}`;
  const isUpcomingEvent = new Date(start) > new Date();

  return (
    <Modal open={open} onClose={onClose} bottomSheet>
      <div className={styles.image}>
        <button type="submit" aria-label="Close" className={styles.close}>
          <CloseIcon aria-hidden />
        </button>
        <PointsDisplay points={event.pointValue} attended={attended} />
        <Image src={displayCover} alt="Event Cover Image" style={{ objectFit: 'cover' }} fill />
      </div>
      <div className={styles.contents}>
        <div className={styles.header}>
          <div className={styles.eventDetails}>
            <CommunityLogo community={event.committee} size={100} />
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

          {isUpcomingEvent ? <CalendarButtons event={event} /> : null}
        </div>

        <Typography variant="body/medium" style={{ wordBreak: 'break-word' }}>
          {description}
        </Typography>
        <Link className={styles.link} href={displayEventLink}>
          <div style={{ width: 11 }}>
            <LinkIcon role="link" />
          </div>
          <Typography
            variant="body/medium"
            style={{ color: 'var(--theme-primary-2)', wordBreak: 'break-all' }}
          >
            {displayEventLink}
          </Typography>
        </Link>
      </div>
    </Modal>
  );
};

export default EventModal;
