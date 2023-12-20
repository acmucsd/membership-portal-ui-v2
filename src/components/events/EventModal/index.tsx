import { Typography } from '@/components/common';
import CommunityLogo from '@/components/common/CommunityLogo';
import CalendarButtons from '@/components/events/CalendarButtons';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatEventDate } from '@/lib/utils';
import LinkIcon from '@/public/assets/icons/link.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface EventModalProps {
  open: boolean;
  event: PublicEvent;
  onClose: () => void;
}

const EventModal = ({ open, event, onClose }: EventModalProps) => {
  const { cover, title, start, end, location, description, eventLink } = event;

  let displayCover = cover;
  if (!displayCover) {
    displayCover = '/assets/graphics/store/hero-photo.jpg';
  }

  let displayEventLink = eventLink;
  if (!eventLink) {
    displayEventLink = `https://acmucsd.com/events/${event.uuid}`;
  }

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current && open) {
      ref.current.showModal();
    }
  }, [open]);

  return (
    // Justification for disabling eslint rules: Clicking on the faded area
    // isn't the only way to close the modal; you can also click the close
    // button. HTML already supports pressing the escape key to close modals, so
    // I don't need to add my own.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      className={styles.modal}
      ref={ref}
      onClick={e => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
      }}
      onClose={onClose}
    >
      <form method="dialog" className={styles.modalBody}>
        <div className={styles.image}>
          <Image src={displayCover} alt="Event Cover Image" layout="fill" objectFit="cover" />
        </div>
        <div className={styles.contents}>
          <div className={styles.header}>
            <div className={styles.eventDetails}>
              <CommunityLogo community={event.committee} width={100} />
              <div>
                <Typography variant="title/large" style={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography variant="title/medium">{formatEventDate(start, end)}</Typography>
                <Typography variant="title/medium">{location}</Typography>
              </div>
            </div>

            <CalendarButtons event={event} />
          </div>

          <Typography variant="body/medium">{description}</Typography>
          <Link className={styles.link} href={displayEventLink}>
            <LinkIcon aria="Link" />
            <Typography variant="body/medium" style={{ color: 'var(--theme-primary-2)' }}>
              {displayEventLink}
            </Typography>
          </Link>
        </div>
      </form>
    </dialog>
  );
};

export default EventModal;
