import ManageEventControls from '@/components/admin/event/ManageEventControls';
import { config } from '@/lib';
import { PublicEvent } from '@/lib/types/apiResponses';
import { formatEventDate } from '@/lib/utils';
import AILogo from '@/public/assets/acm-logos/communities/ai.png';
import CyberLogo from '@/public/assets/acm-logos/communities/cyber.png';
import DesignLogo from '@/public/assets/acm-logos/communities/design.png';
import HackLogo from '@/public/assets/acm-logos/communities/hack.png';
import ACMLogo from '@/public/assets/acm-logos/general/light-mode.png';
import Image from 'next/image';
import { ReactNode } from 'react';
import style from './style.module.scss';

interface IProps {
  event: PublicEvent;
  viewMode: 'card' | 'row';
}

const getCommunityLogo = (event: PublicEvent, size: number): ReactNode => {
  switch (event.committee.toLowerCase()) {
    case 'hack':
      return <Image src={HackLogo} width={size} alt="ACM Hack Logo" />;
    case 'ai':
      return <Image src={AILogo} width={size} alt="ACM AI Logo" />;
    case 'cyber':
      return <Image src={CyberLogo} width={size} alt="ACM Cyber Logo" />;
    case 'design':
      return <Image src={DesignLogo} width={size} alt="ACM Design Logo" />;
    default:
      return <Image src={ACMLogo} width={size} alt="ACM General Logo" />;
  }
};

const ManageEventCard = ({ event, viewMode }: IProps) => {
  if (viewMode === 'card') {
    return (
      <div key={event.uuid} className={style.cardEvent}>
        <div className={style.coverContainer}>
          <Image
            src={event?.cover || config.defaultEventImage}
            alt="Event Cover"
            className={style.cover}
            fill
          />
        </div>
        <h3 className={style.eventTitle}>
          {getCommunityLogo(event, 32)}
          {event.title}
          {getCommunityLogo(event, 32)}
        </h3>
        <span>{formatEventDate(event.start, event.end)}</span>
        <span>{event.location}</span>
        <ManageEventControls event={event} />
      </div>
    );
  }
  return (
    <div key={event.uuid} className={style.rowEvent}>
      <div className={style.eventInfo}>
        {getCommunityLogo(event, 48)}
        <div className={style.eventText}>
          <h3>{event.title}</h3>
          <span>{formatEventDate(event.start, event.end)}</span>
        </div>
      </div>
      <ManageEventControls event={event} />
    </div>
  );
};

export default ManageEventCard;
