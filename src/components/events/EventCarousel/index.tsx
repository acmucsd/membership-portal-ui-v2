import { Carousel, Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import DiamondFriends from '@/public/assets/graphics/portal/diamond-friends.svg';
import Link from 'next/link';
import type { ReactNode } from 'react';
import EventCard from '../EventCard';
import styles from './style.module.scss';

interface EventCarouselProps {
  title: string | ReactNode;
  titleClassName?: string;
  events: PublicEvent[];
  attendances: PublicAttendance[];
  placeholder: string;
  className?: string;
}

const EventCarousel = ({
  title,
  titleClassName,
  events,
  attendances,
  placeholder,
  className = '',
}: EventCarouselProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Typography variant="h2/bold" className={titleClassName}>
            {title}
          </Typography>
        </div>
        <Link className={styles.viewToggle} href={config.eventsRoute}>
          See all events &gt;
        </Link>
      </div>
      {events.length > 0 ? (
        <Carousel>
          {events.map(event => (
            <EventCard
              className={styles.card}
              key={event.uuid}
              event={event}
              attended={attendances.some(a => a.event.uuid === event.uuid)}
            />
          ))}
        </Carousel>
      ) : (
        <div className={styles.noEvents}>
          <DiamondFriends />
          <Typography variant="h4/regular">{placeholder}</Typography>
        </div>
      )}
    </div>
  );
};

export default EventCarousel;
