import { communityNames } from '@/lib/constants/communities';
import { PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { isOrderPickupEvent, toCommunity } from '@/lib/utils';
import styles from './style.module.scss';

interface EventBadgesProps {
  event: PublicEvent | PublicOrderPickupEvent;
  attended: boolean;
  className?: string;
}

const EventBadges = ({ event, attended, className }: EventBadgesProps) => {
  const { committee } = isOrderPickupEvent(event)
    ? {
        ...(event.linkedEvent ?? {}),
        ...event,
      }
    : event;
  const community = toCommunity(committee);

  const now = new Date();
  const ongoing = now > new Date(event.start) && now < new Date(event.end);

  return (
    <div className={`${styles.badges} ${className || ''}`}>
      {!isOrderPickupEvent(event) && ongoing ? (
        <div className={`${styles.badge} ${styles.badgeLive}`}>
          <span>•</span> Live
        </div>
      ) : null}
      {committee ? (
        <div className={`${styles.badge} ${styles[`badge${community}`]}`}>
          {communityNames[community]}
        </div>
      ) : null}
      {!isOrderPickupEvent(event) ? (
        <div className={`${styles.badge} ${styles.badgePoints}`}>
          {event.pointValue} point{event.pointValue === 1 ? '' : 's'}
        </div>
      ) : null}
      {!isOrderPickupEvent(event) && attended ? (
        <div className={`${styles.badge} ${styles.badgeAttended}`}>Attended</div>
      ) : null}
    </div>
  );
};

export default EventBadges;
