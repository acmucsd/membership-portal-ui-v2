import { EventDetailsForm } from '@/components/admin/event';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { DateTime } from 'luxon';

interface EditEventProps {
  editEvent: PublicEvent;
}

const EditEventPage = ({ editEvent }: EditEventProps) => (
  <EventDetailsForm
    editing
    defaultData={{
      ...editEvent,
      start: DateTime.fromISO(editEvent.start).toFormat("yyyy-MM-dd'T'HH:mm"),
      end: DateTime.fromISO(editEvent.end).toFormat("yyyy-MM-dd'T'HH:mm"),
    }}
  />
);

export default EditEventPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ params, authToken }) => {
  const uuid = params?.uuid as string;

  try {
    const editEvent = await EventAPI.getEvent(uuid, authToken);
    return {
      props: { title: `Edit ${editEvent.title}`, editEvent },
    };
  } catch (err: any) {
    return { redirect: { destination: config.admin.homeRoute, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents,
  { redirectTo: config.admin.homeRoute }
);
