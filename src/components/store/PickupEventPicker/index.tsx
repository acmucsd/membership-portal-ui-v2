import { Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { PublicEvent } from '@/lib/types/apiResponses';
import ArrowLeft from '@/public/assets/icons/arrow-left.svg';
import ArrowRight from '@/public/assets/icons/arrow-right.svg';
import styles from './style.module.scss';

interface EventPickerProps {
  events: PublicEvent[];
  eventIndex: number;
  setEventIndex: (...args: any[]) => any;
  active: boolean;
}

const PickupEventPicker = ({ events, eventIndex, setEventIndex, active }: EventPickerProps) => {
  return (
    <div className={styles.eventPicker}>
      <div className={styles.window}>
        <div className={styles.slider} style={{ transform: `translateX(${-320 * eventIndex}px)` }}>
          {events.map(event => (
            <EventCard key={event.uuid} event={event} attended={false} />
          ))}
        </div>
      </div>

      {active && (
        <div className={styles.eventNavigation}>
          <button
            type="button"
            onClick={() => setEventIndex((i: number) => (i > 0 ? i - 1 : 0))}
            aria-label="Previous Event"
            disabled={eventIndex <= 0}
          >
            <ArrowLeft />
          </button>
          <Typography variant="h5/regular" component="p">{`${eventIndex + 1}/${
            events.length
          }`}</Typography>
          <button
            type="button"
            onClick={() => setEventIndex((i: number) => Math.min(i + 1, events.length - 1))}
            aria-label="Next Event"
            disabled={eventIndex >= events.length - 1}
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PickupEventPicker;
