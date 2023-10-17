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

  const duplicateEvent = () => {
    router.push(`/admin/event/create?duplicate=${event.uuid}`, {});
  };

  const generateDiscordEvent = () => {
    AdminEventManager.createDiscordEvent({
      ...event,
      onSuccessCallback: () => {
        showToast('Successfully created event!', 'Check your server to confirm all details');
      },
      onFailCallback: e => {
        showToast('error', e);
      },
    });
  };

  const generateACMURL = () => {
    showToast('Function not implemented yet!');
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
      <a href={`https://acmucsd.com/events/${event.uuid}`}>View Public Event Page</a>
      <Link href={`/admin/event/edit/${event.uuid}`}>Edit Details</Link>
      <Button onClick={duplicateEvent}>Duplicate Event</Button>
      <Button onClick={generateDiscordEvent}>Generate Discord Event</Button>
      <Button onClick={generateACMURL}>Generate ACMURL</Button>
    </div>
  );
};

export default ManageEventCard;
