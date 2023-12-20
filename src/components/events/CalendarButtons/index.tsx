import { showToast } from '@/lib';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatURLEventTitle } from '@/lib/utils';
import AppleCalendarLogo from '@/public/assets/icons/applecalendar.svg';
import GoogleCalendarLogo from '@/public/assets/icons/googlecalendar.svg';
import * as ics from 'ics';
import styles from './style.module.scss';

// Referencing this answer to save text in a file and download it
// https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
const createDownloadFile = (textContent: string, title: string): void => {
  const element = document.createElement('a');
  const file = new Blob([textContent], { type: 'text/calendar' });
  element.href = URL.createObjectURL(file);
  element.download = `${title}.ics`;
  document.body.appendChild(element);
  element.click();
};

const saveToGoogleCal = ({ title, description, location, start, end }: PublicEvent): void => {
  const url = new URL('https://www.google.com/calendar/render?action=TEMPLATE');
  const params = new URLSearchParams(url.search);
  params.append('text', title);
  params.append('details', description);
  params.append('location', location);
  const startISO = start.replaceAll('-', '').replaceAll(':', '').replaceAll('.', '');
  const endISO = end.replaceAll('-', '').replaceAll(':', '').replaceAll('.', '');
  params.append('dates', `${startISO}/${endISO}`);

  const GCAL_LINK = `${url.origin}${url.pathname}?${params.toString()}`;
  window.open(GCAL_LINK);
};

const saveToAppleCal = (event: PublicEvent): void => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const duration = endDate.getTime() - startDate.getTime();

  const attributes: ics.EventAttributes = {
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1, // Library is 1-indexed rather than 0-indexed
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
    ],
    duration: { minutes: duration / (1000 * 60) },
    title: event.title,
    description: event.description,
    location: event.location,
    url: `https://acmucsd.com/events/${formatURLEventTitle(event.title)}-${event.uuid}`,
    organizer: { name: 'ACM at UCSD', email: 'acm@ucsd.edu' },
  };

  const response = ics.createEvent(attributes);
  if (response.value) {
    createDownloadFile(response.value, formatURLEventTitle(event.title));
  } else {
    showToast(response.error?.message || 'An error occurred when saving to Apple Calendar.');
  }
};

interface CalendarButtonProps {
  event: PublicEvent;
}

const CalendarButtons = ({ event }: CalendarButtonProps) => {
  return (
    <div className={styles.options}>
      <button
        type="button"
        className={styles.calendarButton}
        onClick={() => saveToGoogleCal(event)}
      >
        <GoogleCalendarLogo alt="google calendar" />
        <b>Add to Google Calendar</b>
      </button>
      <button type="button" className={styles.calendarButton} onClick={() => saveToAppleCal(event)}>
        <AppleCalendarLogo alt="apple calendar" />
        <b>Add to Apple Calendar</b>
      </button>
    </div>
  );
};

export default CalendarButtons;
