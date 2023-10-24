import CheckIcon from '@/public/assets/icons/check-icon.svg';
import Image from 'next/image';
import styles from './style.module.scss';

const format = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

interface EventCardProps {
  cover: string;
  title: string;
  start: string;
  end: string;
  location: string;
  pointValue: number;
  attended: boolean;
}

const EventCard = ({
  cover,
  title,
  start,
  end,
  location,
  pointValue,
  attended,
}: EventCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        <Image src={cover} alt={`Cover photo for ${title}`} fill />
      </div>
      <div className={styles.bottom}>
        <div className={styles.details}>
          <h3>{title}</h3>
          {/* HACK: Server side uses different whitespace characters. */}
          <p>{format.formatRange(new Date(start), new Date(end)).replace(/\s/g, ' ')}</p>
          <p>{location}</p>
        </div>
        <div className={`${styles.points} ${attended ? styles.attended : ''}`}>
          <strong>{pointValue}</strong>
          {attended ? <CheckIcon /> : 'points'}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
