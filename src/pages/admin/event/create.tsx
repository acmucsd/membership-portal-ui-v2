import { EventDetailsForm } from '@/components/admin/event';
import { config } from '@/lib';
import { EventAPI, KlefkiAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { NotionEventPreview, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps, NextPage } from 'next';

interface CreateEventProps {
  defaultData: Partial<PublicEvent>;
  upcomingEvents: NotionEventPreview[];
}
const CreateEventPage: NextPage<CreateEventProps> = ({ defaultData, upcomingEvents }) => (
  <EventDetailsForm defaultData={defaultData} upcomingEvents={upcomingEvents} />
);

export default CreateEventPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const upcomingEvents = await KlefkiAPI.getFutureEventsPreview();
  if (typeof query.duplicate === 'string') {
    const defaultData = await EventAPI.getEvent(query.duplicate, token);
    return {
      props: { defaultData, upcomingEvents },
    };
  }
  return {
    props: { defaultData: {}, upcomingEvents },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents(),
  config.admin
);
