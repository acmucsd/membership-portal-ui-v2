import { EventDetailsForm } from '@/components/admin/event';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps, NextPage } from 'next';

interface CreateEventProps {
  defaultData: Partial<PublicEvent>;
}
const CreateEventPage: NextPage<CreateEventProps> = ({ defaultData }) => (
  <EventDetailsForm defaultData={defaultData} />
);

export default CreateEventPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  if (typeof query.duplicate === 'string') {
    const defaultData = await EventAPI.getEvent(query.duplicate, token);
    return {
      props: { defaultData },
    };
  }
  return {
    props: { defaultData: {} },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents(),
  config.admin
);
