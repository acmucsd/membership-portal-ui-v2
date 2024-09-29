import { Typography } from '@/components/common';
import { DEFAULT_FILTER_STATE, EventCard, EventFilter } from '@/components/events';
import { ItemCard } from '@/components/store';
import { PublicEvent, PublicMerchItem } from '@/lib/types/apiResponses';
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

const dummyItems: PublicMerchItem[] = [
  {
    uuid: '3b5f570a-1ced-4ab2-9e27-db42742e1034',
    itemName: 'ACM Black and Gold Hoodie',
    merchPhotos: [
      {
        uuid: '10ff5d5b-bacd-461f-9502-72bf5c51f28f',
        uploadedPhoto:
          'https://acmucsd.s3.us-west-1.amazonaws.com/portal/merch/3b5f570a-1ced-4ab2-9e27-db42742e1034.JPG',
        uploadedAt: '2023-12-31T20:24:09.910Z',
        position: 0,
      },
    ],
    description: 'Snuggle up for the cold winter months with this ultra soft ACM hoodie',
    options: [
      {
        uuid: '68219211-90d8-4782-b336-61a6ee026d6b',
        price: 15000,
        discountPercentage: 0,
        metadata: {
          type: 'Size',
          value: 'XL',
          position: 3,
        },
        quantity: 0,
      },
    ],
    monthlyLimit: 1,
    lifetimeLimit: 1,
    hidden: false,
    hasVariantsEnabled: true,
  },
  {
    uuid: '44f28b36-7c5a-49da-99b3-e7bb791ae0f7',
    itemName: 'ACM Black and Gold Sweater',
    merchPhotos: [
      {
        uuid: '5b15b2ab-8794-43c1-af3e-907d8fbb6cfa',
        uploadedPhoto:
          'https://acmucsd.s3.us-west-1.amazonaws.com/portal/merch/44f28b36-7c5a-49da-99b3-e7bb791ae0f7.JPG',
        uploadedAt: '2023-12-31T20:24:09.910Z',
        position: 0,
      },
    ],
    description: 'Show your ACM spirit with this soft and trendy sweater that goes with any outfit',
    options: [
      {
        uuid: '680b98ee-4c3d-4d89-986c-54f9d9e3cb63',
        price: 15000,
        discountPercentage: 0,
        metadata: {
          type: 'Size',
          value: 'S',
          position: 0,
        },
        quantity: 0,
      },
    ],
    monthlyLimit: 1,
    lifetimeLimit: 1,
    hidden: false,
    hasVariantsEnabled: true,
  },
  {
    uuid: 'ca167434-7654-4c54-b3c6-28aa518e858c',
    itemName: 'ACM White and Blue Hoodie',
    merchPhotos: [
      {
        uuid: 'b507d6f7-539c-4f67-9f28-c1ae27986c8d',
        uploadedPhoto:
          'https://acmucsd.s3.us-west-1.amazonaws.com/portal/merch/ca167434-7654-4c54-b3c6-28aa518e858c.JPG',
        uploadedAt: '2023-12-31T20:24:09.910Z',
        position: 0,
      },
    ],
    description: 'Prepare for spring with our refreshing and comfy white and blue hoodie!',
    options: [
      {
        uuid: '0436ba65-1822-4f20-981a-fb8297297982',
        price: 15000,
        discountPercentage: 0,
        metadata: {
          type: 'Sizes',
          value: 'M',
          position: 1,
        },
        quantity: 0,
      },
    ],
    monthlyLimit: 1,
    lifetimeLimit: 1,
    hidden: false,
    hasVariantsEnabled: true,
  },
];

const BadgeAnnotation = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.annotationWrapper}>
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
      <div className={styles.items}>
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

const CostAnnotation = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.annotationWrapper}>
      {children}
      <div className={styles.annotation}>
        You need to collect the listed number of points to make the purchase.
      </div>
    </div>
  );
};

const Store = () => {
  return (
    <div className={styles.page}>
      <div className={styles.fadeOut}>
        <Typography variant="h3/bold" component="h3">
          The Cozy Collection
        </Typography>
        <Typography variant="h5/regular" component="p">
          Bundle up by the fire with a blanket and this new collection of cute sweaters and hoodies.
        </Typography>
      </div>
      <div className={styles.items}>
        {dummyItems.map((item, i) => (
          <ItemCard
            images={item.merchPhotos.map(photo => photo.uploadedPhoto)}
            title={item.itemName}
            cost={item.options[0]?.price ?? 0}
            discountPercentage={item.options[0]?.discountPercentage ?? 0}
            className={i !== 0 ? `${styles.desktopOnly} ${styles.fadeOut}` : undefined}
            costWrapper={i === 0 ? CostAnnotation : undefined}
            key={item.uuid}
          />
        ))}
      </div>
    </div>
  );
};

export { Events, Store };
