import { Button } from '@/components/common';
import { showToast } from '@/lib';
import { AdminEventManager } from '@/lib/managers';
import type { NotionEventDetails, NotionEventPreview } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import style from './style.module.scss';

interface IProps {
  setFields: (data: NotionEventDetails) => void;
  loading: boolean;
  upcomingEvents: NotionEventPreview[];
}

const NotionAutofill = ({ setFields, loading, upcomingEvents }: IProps) => {
  const [query, setQuery] = useState('');
  const [activeOption, setActiveOption] = useState<string | undefined>(undefined);

  useEffect(() => {
    setQuery(activeOption ?? '');
  }, [activeOption]);

  const autofillForm = () =>
    AdminEventManager.getEventFromNotionURL({
      pageUrl: query,
      onSuccessCallback: data => {
        setFields(data);
        showToast(`Filled out fields for event: ${data.title}!`);
      },
      onFailCallback: err => {
        reportError('Notion API Error', err);
      },
    });

  const defaultFormText = loading ? 'Loading events from Notion...' : 'Select an Event';

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
          <option key={event.url} value={event.url}>
            {event.title} ({DateTime.fromISO(event.date.start).toFormat('f')})
          </option>
        ))}
      </select>
      <div className={style.row}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Notion Calendar URL"
        />
        <Button onClick={autofillForm} variant="primary" size="small" disabled={loading}>
          Autofill Form
        </Button>
      </div>
    </div>
  );
};

export default NotionAutofill;
