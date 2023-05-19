import { EventDetailsForm } from '@/components/admin/event';
import { config } from '@/lib';
import { EventAPI, KlefkiAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { NotionEventPreview, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { DateTime } from 'luxon';
import type { GetServerSideProps } from 'next/types';

interface EditEventProps {
  editEvent: PublicEvent;
  upcomingEvents: NotionEventPreview[];
}

const EditEventPage = ({ editEvent, upcomingEvents }: EditEventProps) => (
  <EventDetailsForm
    editing
    defaultData={{
      ...editEvent,
      start: DateTime.fromISO(editEvent.start).toFormat("yyyy-MM-dd'T'HH:mm"),
      end: DateTime.fromISO(editEvent.end).toFormat("yyyy-MM-dd'T'HH:mm"),
    }}
    upcomingEvents={upcomingEvents}
  />
);

export default EditEventPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const upcomingEvents = await KlefkiAPI.getFutureEventsPreview();

  try {
    const editEvent = await EventAPI.getEvent(uuid, token);
    return {
      props: {
        editEvent,
        upcomingEvents,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.admin, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents(),
  config.admin
);
