import { Typography } from '@/components/common';
import { DEFAULT_FILTER_STATE, EventCard, EventFilter } from '@/components/events';
import { PublicEvent } from '@/lib/types/apiResponses';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

const dummyEvents: PublicEvent[] = [
  {
    uuid: 'fd14f1bd-2985-425e-b706-7798767ee138',
    organization: 'ACM',
    committee: 'General',
    thumbnail: null,
    cover:
      'https://acmucsd.s3.us-west-1.amazonaws.com/portal/events/fd14f1bd-2985-425e-b706-7798767ee138.png',
    title: 'Fall Kickoff',
    description:
      "ACM at UCSD is UC San Diego's largest computer science organization, with over 1,500 members and over 200 technical, professional, and social events year-round. We’re not just computer science, though — we bring together anyone and everyone who shares our love of technology, design, and innovation! Join us to find out how you can engage in our community for the Fall Quarter through socials, live coding workshops, tech talks, and much more. We welcome people of all backgrounds and skill levels, whether you’re an entry-level UI designer or a machine learning expert. Come be a part of our rapidly growing community of friends at the first kickoff of the year!",
    location: 'PC West Ballroom',
    eventLink: 'acmurl.com/kickoff-F24',
    start: '2024-10-01T01:00:00.000Z',
    end: '2024-10-01T04:00:00.000Z',
    pointValue: 10,
    requiresStaff: false,
    staffPointBonus: 0,
    discordEvent: '1285653645505069086',
  },
  {
    uuid: 'e154acf7-3465-49e4-baa6-f40bfa2f4ad8',
    organization: 'ACM',
    committee: 'Cyber',
    thumbnail: null,
    cover:
      'https://acmucsd.s3.us-west-1.amazonaws.com/portal/events/e154acf7-3465-49e4-baa6-f40bfa2f4ad8.png',
    title: 'Lockpicking 101',
    description:
      "Wanna learn how to pick locks? Ever gotten locked out of your dorm? \n\nCome and join ACM Cyber at Lockpicking 101! We'll be demonstrating the core theory of breaking the security of locks, including techniques such as bumping, raking, single-pin picking, and impressioning! We will also be providing practice locks and picks for YOU🫵 to hone your picking skills. Become a lockpicking virtuoso 🤩✨✨",
    location: 'SME ASML Room',
    eventLink: 'acmurl.com/lockpicking',
    start: '2024-04-13T01:30:00.000Z',
    end: '2024-04-13T03:30:00.000Z',
    pointValue: 10,
    requiresStaff: false,
    staffPointBonus: 0,
    discordEvent: null,
  },
  {
    uuid: '9d2023d4-3649-4407-8538-d71687656c45',
    organization: 'ACM',
    committee: 'AI',
    thumbnail: null,
    cover:
      'https://acmucsd.s3.us-west-1.amazonaws.com/portal/events/9d2023d4-3649-4407-8538-d71687656c45.png',
    title: 'Deep Reinforcement Learning',
    description:
      "Come learn about AI tools and models at ACM AI's third spring quarter technical workshop!",
    location: 'DIB 202/208',
    eventLink: 'acmurl.com/ai-sp-ws3',
    start: '2023-06-03T01:00:00.000Z',
    end: '2023-06-03T03:00:00.000Z',
    pointValue: 10,
    requiresStaff: false,
    staffPointBonus: 0,
    discordEvent: null,
  },
];

const BadgeAnnotation = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.badgeWrapper}>
      {children}
      <div className={styles.annotation}>
        Each event is categorized under one of the ACM communities and tagged with the number of
        points you can earn from attending.
      </div>
    </div>
  );
};

const Events = () => {
  return (
    <div className={styles.page}>
      <Typography variant="headline/heavy/small" className={styles.fadeOut}>
        Events
      </Typography>
      <EventFilter
        className={`${styles.desktopOnly} ${styles.fadeOut}`}
        filters={{
          search: DEFAULT_FILTER_STATE.search,
          communityFilter: DEFAULT_FILTER_STATE.community,
          dateFilter: DEFAULT_FILTER_STATE.date,
          attendanceFilter: DEFAULT_FILTER_STATE.attendance,
        }}
      />
      <div className={styles.events}>
        {dummyEvents.map((event, i) => (
          <EventCard
            key={event.uuid}
            event={event}
            attended={false}
            showYear
            className={i !== 0 ? `${styles.desktopOnly} ${styles.fadeOut}` : undefined}
            badgeWrapper={i === 0 ? BadgeAnnotation : undefined}
            interactive={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
