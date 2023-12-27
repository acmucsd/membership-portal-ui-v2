import { Typography } from '@/components/common';
import CommunityLogo from '@/components/common/CommunityLogo';
import EventModal from '@/components/events/EventModal';
import PointsDisplay from '@/components/events/PointsDisplay';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatEventDate } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import styles from './style.module.scss';

interface EventCardProps {
  event: PublicEvent;
  attended: boolean;
}

const EventCard = ({ event, attended }: EventCardProps) => {
  const { cover, title, start, end, location } = event;
  const [expanded, setExpanded] = useState(false);

  const displayCover = cover || '/assets/graphics/store/hero-photo.jpg';

  return (
    <>
      <EventModal
        open={expanded}
        attended={attended}
        event={event}
        onClose={() => setExpanded(false)}
      />
      <button type="button" className={styles.container} onClick={() => setExpanded(true)}>
        <div className={styles.image}>
          <PointsDisplay points={event.pointValue} attended={attended} />
          <Image src={displayCover} alt="Event Cover Image" style={{ objectFit: 'cover' }} fill />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <CommunityLogo community={event.committee} width={50} />
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
                {formatEventDate(start, end)}
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
