import EventCard from '@/components/events/EventCard';
import { PublicEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

interface EventDisplayProps {
  events: PublicEvent[];
}

const EventDisplay = ({ events }: EventDisplayProps) => {
  const displayedEvents = events;
  if (events.length > 1) {
    // displayedEvents = events.slice(0, 1);
  }
  return (
    <div className={styles.container}>
      {displayedEvents.map(event => (
        <EventCard key={event.uuid} event={event} />
      ))}
    </div>
  );
};

export default EventDisplay;
