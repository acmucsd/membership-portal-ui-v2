import { Button } from '@/components/common';
import { GoogleCalendarButton } from '@/components/events/CalendarButtons';
import { config, showToast } from '@/lib';
import { AdminEventManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import style from './style.module.scss';

interface IProps {
  event: PublicEvent;
}

const ManageEventCard = ({ event }: IProps) => {
  const router = useRouter();
  const [acmurlLoading, setAcmurlLoading] = useState(false);
  const [discordEvent, setDiscordEvent] = useState<string | null>(event.discordEvent);

  const publicEventLink = `https://acmucsd.com/events/${event.uuid}`;

  const duplicateEvent = () => {
    router.push(`${config.admin.events.createRoute}?duplicate=${event.uuid}`);
  };

  const generateDiscordEvent = () => {
    AdminEventManager.createDiscordEvent({
      ...event,
      image: event.cover,
      onSuccessCallback: data => {
        const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
        const eventID = data.split(' ').pop();

        AdminEventManager.editEvent({
          token: AUTH_TOKEN,
          uuid: event.uuid,
          event: {
            ...event,
            discordEvent: eventID,
          },
          onFailCallback: error => {
            reportError('Unable to edit event', error);
          },
        });

        if (eventID) setDiscordEvent(eventID);
        showToast('Successfully created event!', 'Check your server to confirm all details');
      },
      onFailCallback: e => {
        reportError('Error while generating Discord Event!', e);
      },
    });
  };

  const updateDiscordEvent = () => {
    if (!discordEvent) {
      showToast("Couldn't update Discord Event...", `${event.title} doesn't have a Discord Event!`);
      return;
    }

    AdminEventManager.patchDiscordEvent({
      ...event,
      eventID: discordEvent,
      image: event.cover,
      onSuccessCallback: () => {
        showToast('Successfully edited event!', 'Check your server to confirm all details');
      },
      onFailCallback: e => {
        reportError('Error while editing Discord Event!', e);
      },
    });
  };

  const deleteDiscordEvent = () => {
    if (!discordEvent) {
      showToast("Couldn't delete Discord Event...", `${event.title} doesn't have a Discord Event!`);
      return;
    }

    AdminEventManager.deleteDiscordEvent({
      ...event,
      discordEvent,
      onSuccessCallback: () => {
        setDiscordEvent(null);
        showToast('Successfully deleted event!', 'Check your server to confirm deletion');
      },
      onFailCallback: e => {
        reportError('Error while deleting Discord Event!', e);
      },
    });
  };

  const generateACMURL = () => {
    if (!event.eventLink) {
      showToast("Couldn't generate ACMURL...", `${event.title} doesn't have an event link!`);
    } else {
      let acmurl = event.eventLink;

      // Try to get the acmurl if eventLink is formatted as acmurl.com/{VALUE_HERE}.
      const acmurlRegex = /acmurl\.com\/(.*)/;
      const regexMatch = event.eventLink.match(acmurlRegex);
      if (regexMatch && regexMatch.length > 1) {
        acmurl = regexMatch[1] as string;
      }

      setAcmurlLoading(true);
      AdminEventManager.generateACMURL({
        shortlink: acmurl,
        longlink: publicEventLink,
        onSuccessCallback: () => {
          setAcmurlLoading(false);
          showToast(
            'Successfully generated ACMURL!',
            `acmurl.com/${acmurl} will now redirect to ${publicEventLink}`
          );
        },
        onFailCallback: e => {
          setAcmurlLoading(false);
          reportError('Error while generating ACMURL!', e);
        },
      });
    }
  };

  return (
    <div key={event.uuid} className={style.event}>
      <div className={style.coverContainer}>
        <Image
          src={event?.cover || config.defaultEventImage}
          alt="Event Cover"
          className={style.cover}
          fill
        />
      </div>
      <h3>{event.title}</h3>
      <br />
      <a href={publicEventLink}>View Public Event Page</a>
      <Link href={`${config.admin.events.editRoute}/${event.uuid}`}>Edit Details</Link>
      <Button onClick={duplicateEvent}>Duplicate Event</Button>
      {!discordEvent && <Button onClick={generateDiscordEvent}>Create New Discord Event</Button>}
      {discordEvent && <Button onClick={updateDiscordEvent}>Update Discord Event</Button>}
      {discordEvent && <Button onClick={deleteDiscordEvent}>Delete Discord Event</Button>}
      <Button onClick={generateACMURL} disabled={acmurlLoading}>
        Generate ACMURL
      </Button>
      <GoogleCalendarButton event={event} />
    </div>
  );
};

export default ManageEventCard;
