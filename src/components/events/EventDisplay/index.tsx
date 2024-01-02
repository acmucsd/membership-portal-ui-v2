import { Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { PublicAttendance, PublicEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

interface EventDisplayProps {
  events: PublicEvent[];
  attendances: PublicAttendance[];
}

const EventDisplay = ({ events, attendances }: EventDisplayProps) => {
  if (events.length === 0) {
    return <Typography variant="title/small">No events found :(</Typography>;
  }
  return (
    <div className={styles.container}>
      {events.map(event => (
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
