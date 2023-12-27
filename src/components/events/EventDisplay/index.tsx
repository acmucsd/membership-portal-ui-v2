import EventCard from '@/components/events/EventCard';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

interface EventDisplayProps {
  events: PublicEvent[];
  attendances: PublicAttendance[];
}

const EventDisplay = ({ events, attendances }: EventDisplayProps) => {
  const displayedEvents = events;
  return (
    <div className={styles.container}>
      {displayedEvents.map(event => (
        <EventCard
          key={event.uuid}
          event={event}
          attended={attendances.some(a => a.event.uuid === event.uuid)}
        />
      ))}
    </div>
  );
};

export default EventDisplay;
