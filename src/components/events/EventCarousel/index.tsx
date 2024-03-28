import { Carousel, Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import Link from 'next/link';
import EventCard from '../EventCard';
import styles from './style.module.scss';

interface EventCarouselProps {
  title: string;
  events: PublicEvent[];
  attendances: PublicAttendance[];
}

const EventCarousel = ({ title, events, attendances }: EventCarouselProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Typography variant="h2/bold">{title}</Typography>
        </div>
        <Link className={styles.viewToggle} href={config.eventsRoute}>
          See all events &gt;
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
