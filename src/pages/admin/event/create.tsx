import { EventDetailsForm } from '@/components/admin/event';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { NextPage } from 'next';

interface CreateEventProps {
  defaultData: Partial<PublicEvent>;
}
const CreateEventPage: NextPage<CreateEventProps> = ({ defaultData }) => (
  <EventDetailsForm defaultData={defaultData} />
);

export default CreateEventPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ query, authToken }) => {
  if (typeof query.duplicate === 'string') {
    const defaultData = await EventAPI.getEvent(query.duplicate, authToken);
    return {
      props: { title: 'Create Event', defaultData },
    };
  }
  return {
    props: { title: 'Create Event', defaultData: {} },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents,
  { redirectTo: config.admin.homeRoute }
);
