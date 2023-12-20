import { Typography } from '@/components/common';
import CommunityLogo from '@/components/common/CommunityLogo';
import EventModal from '@/components/events/EventModal';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatEventDate } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import styles from './style.module.scss';

interface EventCardProps {
  event: PublicEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const { cover, title, start, end, location } = event;
  const [expanded, setExpanded] = useState(false);

  let displayCover = cover;
  if (!displayCover) {
    displayCover = '/assets/graphics/store/hero-photo.jpg';
  }

  return (
    <>
      {expanded && <EventModal open={expanded} event={event} onClose={() => setExpanded(false)} />}
      <button type="button" className={styles.container} onClick={() => setExpanded(true)}>
        <div className={styles.image}>
          <Image src={displayCover} alt="Event Cover Image" layout="fill" objectFit="cover" />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <CommunityLogo community={event.committee} width={50} />
            <div className={styles.eventDetails}>
              <Typography variant="body/medium" style={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="body/small" suppressHydrationWarning>
                {formatEventDate(start, end)}
              </Typography>
              <Typography variant="body/small">{location}</Typography>
            </div>
          </div>
        </div>
      </button>
    </>
  );
};

export default EventCard;
