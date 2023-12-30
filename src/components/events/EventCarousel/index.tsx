import { Carousel, Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import Link from 'next/link';
import EventCard from '../EventCard';
import styles from './style.module.scss';

interface EventCarouselProps {
  title: string;
  description: string;
  events: PublicEvent[];
  attendances: PublicAttendance[];
}

const EventCarousel = ({ title, description, events, attendances }: EventCarouselProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Typography variant="headline/heavy/small">{title}</Typography>
          <Typography variant="body/medium">{description}</Typography>
        </div>
        <Link className={styles.viewToggle} href={config.eventsRoute}>
          See all events
        </Link>
      </div>
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
    </div>
  );
};

export default EventCarousel;
