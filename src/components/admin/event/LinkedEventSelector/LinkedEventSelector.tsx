import { EventAPI } from '@/lib/api';
import { DateTime } from 'luxon';
import { useState } from 'react';
import style from './style.module.scss';

const LinkedEventSelector = async () => {
  const [activeOption, setActiveOption] = useState<string | undefined>(undefined);

  const defaultFormText = 'Select an Event';

  const upcomingEvents = await EventAPI.getAllFutureEvents();

  return (
    <div className={style.autofill}>
      <select
        name=""
        id=""
        placeholder={defaultFormText}
        onChange={e => setActiveOption(e.target.value)}
        value={activeOption}
        defaultValue={defaultFormText}
      >
        <option disabled>{defaultFormText}</option>

        {upcomingEvents?.map(event => (
          <option key={event.eventLink} value={event.eventLink}>
            {event.title} ({DateTime.fromISO(event.start).toFormat('f')})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LinkedEventSelector;
