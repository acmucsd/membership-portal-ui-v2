import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { AdminEventManager } from '@/lib/managers';
import { PublicEvent } from '@/lib/types/apiResponses';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import style from './style.module.scss';

interface IProps {
  event: PublicEvent;
}

const ManageEventCard = ({ event }: IProps) => {
  const router = useRouter();

  const publicEventLink = `https://acmucsd.com/events/${event.uuid}`;

  const duplicateEvent = () => {
    router.push(`${config.admin.events.createRoute}?duplicate=${event.uuid}`);
  };

  const generateDiscordEvent = () => {
    AdminEventManager.createDiscordEvent({
      ...event,
      image: event.cover,
      onSuccessCallback: () => {
        showToast('Successfully created event!', 'Check your server to confirm all details');
      },
      onFailCallback: e => {
        showToast('Error while generating Discord Event!', e);
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

      AdminEventManager.generateACMURL({
        shortlink: acmurl,
        longlink: publicEventLink,
        onSuccessCallback: () =>
          showToast(
            'Successfully generated ACMURL!',
            `acmurl.com/${acmurl} will now redirect to ${publicEventLink}`
          ),
        onFailCallback: e => showToast('Error while generating ACMURL!', e),
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
      <Button onClick={generateDiscordEvent}>Generate Discord Event</Button>
      <Button onClick={generateACMURL}>Generate ACMURL</Button>
    </div>
  );
};

export default ManageEventCard;
