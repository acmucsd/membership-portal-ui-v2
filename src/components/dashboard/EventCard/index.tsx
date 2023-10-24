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
}

const EventCard = ({ cover, title, start, end, location, pointValue }: EventCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        <Image src={cover} alt={`Cover photo for ${title}`} fill />
      </div>
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{format.formatRange(new Date(start), new Date(end))}</p>
        <p>{location}</p>
      </div>
    </article>
  );
};

export default EventCard;
