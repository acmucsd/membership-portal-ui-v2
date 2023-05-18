import { EventDetailsForm } from '@/components/admin/event';
import { config } from '@/lib';
import { KlefkiAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { NotionEventPreview } from '@/lib/types/apiResponses';
import { GetServerSideProps, NextPage } from 'next';

interface CreateEventProps {
  upcomingEvents: NotionEventPreview[];
}
const CreateEventPage: NextPage<CreateEventProps> = ({ upcomingEvents }) => (
  <EventDetailsForm upcomingEvents={upcomingEvents} />
);

export default CreateEventPage;

const getServerSidePropsFunc: GetServerSideProps = async () => {
  const upcomingEvents = await KlefkiAPI.getFutureEventsPreview();

  return {
    props: { upcomingEvents },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents(),
  config.admin
);
