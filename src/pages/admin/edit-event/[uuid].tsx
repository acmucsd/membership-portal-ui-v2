import { config, showToast } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { AdminEventManager } from '@/lib/managers';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next/types';

interface EditEventProps {
  editEvent: PublicEvent;
}

const EditEvent = ({ editEvent }: EditEventProps) => {
  // const [eventWithChanges, setEventWithChanges] = useState(editEvent);

  const createDiscordEvent = () =>
    AdminEventManager.createDiscordEvent({
      ...editEvent,
      onSuccessCallback: () => {
        showToast('Successfully created event!', 'Check your server to confirm all details');
      },
      onFailCallback: e => {
        showToast('error', e);
      },
    });

  return (
    <div>
      <pre>{JSON.stringify(editEvent, null, 2)}</pre>
      <button type="button" onClick={createDiscordEvent}>
        Generate
      </button>
    </div>
  );
};

export default EditEvent;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const editEvent = await EventAPI.getEvent(uuid, token);
    return {
      props: {
        editEvent,
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
