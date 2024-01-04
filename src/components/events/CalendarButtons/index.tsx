import { Typography } from '@/components/common';
import { showToast } from '@/lib';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatURLEventTitle } from '@/lib/utils';
import AppleCalendarLogo from '@/public/assets/icons/applecalendar.svg';
import GoogleCalendarLogo from '@/public/assets/icons/googlecalendar.svg';
import * as ics from 'ics';
import { useMemo } from 'react';
import styles from './style.module.scss';

/**
 * Given event details, generate a URL that will draft a Google Calendar event.
 */
const generateGCalURL = ({ title, description, location, start, end }: PublicEvent): string => {
  const url = new URL('https://www.google.com/calendar/render?action=TEMPLATE');
  const params = new URLSearchParams(url.search);
  params.append('text', title);
  params.append('details', description);
  params.append('location', location);
  const startISO = start.replaceAll('-', '').replaceAll(':', '').replaceAll('.', '');
  const endISO = end.replaceAll('-', '').replaceAll(':', '').replaceAll('.', '');
  params.append('dates', `${startISO}/${endISO}`);

  const GCAL_URL = `${url.origin}${url.pathname}?${params.toString()}`;
  return GCAL_URL;
};

interface AppleCalInfo {
  href?: string;
  download?: string;
  error?: string;
}

/**
 * Generates info for a Apple Calendar .ics download file.
 * If an error occurs during .ics file generation, returns undefined.
 */
const generateAppleCalInfo = (event: PublicEvent): AppleCalInfo => {
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
    // Referencing this answer to save text in a file and download it
    // https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
    const file = new Blob([response.value], { type: 'text/calendar' });
    const href = URL.createObjectURL(file);
    const download = `${formatURLEventTitle(event.title)}.ics`;
    return { href, download };
  }
  const error = response.error?.message;
  return { error };
};

interface CalendarButtonProps {
  event: PublicEvent;
}

const CalendarButtons = ({ event }: CalendarButtonProps) => {
  const gCalURL = useMemo(() => generateGCalURL(event), [event]);
  const appleCalInfo: AppleCalInfo = generateAppleCalInfo(event);

  return (
    <div className={styles.options}>
      <a className={styles.calendarLink} href={gCalURL} target="blank">
        <GoogleCalendarLogo alt="google calendar" />
        <Typography variant="h6/bold">Add to Google Calendar</Typography>
      </a>
      {appleCalInfo.download ? (
        <a
          className={styles.calendarLink}
          href={appleCalInfo.href}
          download={appleCalInfo.download}
          suppressHydrationWarning
        >
          <AppleCalendarLogo className={styles.appleCalLogo} alt="apple calendar" />
          <Typography variant="h6/bold">Add to Apple Calendar</Typography>
        </a>
      ) : (
        <button
          type="button"
          className={styles.calendarLink}
          onClick={() =>
            showToast(appleCalInfo.error || 'An error occurred when saving to Apple Calendar.')
          }
        >
          <AppleCalendarLogo className={styles.appleCalLogo} alt="apple calendar" />
          <Typography variant="h6/bold">Add to Apple Calendar</Typography>
        </button>
      )}
    </div>
  );
};

export default CalendarButtons;
