import EventDisplay from '@/components/events/EventDisplay';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  user: PrivateProfile;
  events: PublicEvent[];
}

const PortalHomePage = ({ user, events }: HomePageProps) => {
  return (
    <div>
      <h1>Portal Home Page</h1>
      <pre>User Info: {JSON.stringify(user, null, 2)}</pre>
      <EventDisplay events={events} />
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => {
  const events = await EventAPI.getAllEvents();
  return { props: { events } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
