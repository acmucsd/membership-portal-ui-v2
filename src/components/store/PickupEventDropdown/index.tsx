import PickupEventDetail from '@/components/store/PickupEventDetail';
import { Dropdown, Typography } from '@/components/common';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { formatEventDate } from '@/lib/utils';
import styles from './style.module.scss';

interface EventPickerProps {
  events: PublicOrderPickupEvent[];
  eventIndex: number;
  setEventIndex: (...args: any[]) => any;
}

const PickupEventDropdown = ({ events, eventIndex, setEventIndex }: EventPickerProps) => {
  return (
    <div className={styles.eventPicker}>
      {events.length > 0 ? (
        <div className={styles.window}>
          <PickupEventDetail pickupEvent={events[eventIndex] as PublicOrderPickupEvent} />
          <Dropdown
            className={styles.dropdown}
            name="schedulePickup"
            ariaLabel="Select a pickup event"
            options={events.map((e, index) => {
              return {
                value: index.toString(),
                label: `${e.title} (${formatEventDate(e.start, e.end)})`,
              };
            })}
            value={eventIndex.toString()}
            onChange={v => setEventIndex(Number(v))}
          />
        </div>
      ) : (
        <div className={styles.noEvents}>
          <Typography variant="h3/medium" component="span">
            No upcoming pickup events. Check back later!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default PickupEventDropdown;
