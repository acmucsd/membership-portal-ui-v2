import { EventList } from '@/components/events';
import { PublicEvent } from '@/lib/types/apiResponses';
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
    uuid: '4c44e774-ada8-4a04-921e-4587d819effd',
    organization: 'ACM',
    committee: 'General',
    thumbnail: null,
    cover:
      'https://acmucsd.s3.us-west-1.amazonaws.com/portal/events/4c44e774-ada8-4a04-921e-4587d819effd.png',
    title: 'Bit Byte Info Session',
    description:
      "Looking to learn about ACM's Bit-Byte mentorship big/little program? Swing by our info session where we'll discuss the timeline, structure, requirements, and overall vibes! ask any questions and get hyped for the upcoming iteration!",
    location: 'CSE 1202',
    eventLink: 'acmurl.com/bitbyteinfosesh',
    start: '2024-10-02T00:00:00.000Z',
    end: '2024-10-02T01:30:00.000Z',
    pointValue: 10,
    requiresStaff: false,
    staffPointBonus: 0,
    discordEvent: '1288736115079118881',
  },
  {
    uuid: 'eb4cb2c6-f6e1-4fc0-b086-a93ac066d933',
    organization: 'ACM',
    committee: 'General',
    thumbnail: null,
    cover:
      'https://acmucsd.s3.us-west-1.amazonaws.com/portal/events/eb4cb2c6-f6e1-4fc0-b086-a93ac066d933.png',
    title: 'Resume Review',
    description:
      "Recruitment is in season! Come out and join ACM's resume review night, where we'll go over bulletproof strategies for creating and tailoring your resume for whatever opportunities you want to pursue! Regardless of your experience level, we will help you workshop and develop your resume so that you can present your best self!",
    location: 'Qualcomm Room',
    eventLink: 'acmurl.com/resume-review',
    start: '2024-10-03T00:30:00.000Z',
    end: '2024-10-03T02:00:00.000Z',
    pointValue: 10,
    requiresStaff: false,
    staffPointBonus: 0,
    discordEvent: '1288736670102851625',
  },
];

const Events = () => {
  return (
    <div className={styles.page}>
      <EventList events={dummyEvents} />
    </div>
  );
};

export default Events;
