// reference /store/item/new page

import AdminPickupEventForm from '@/components/admin/event/AdminPickupEvent/AdminPickupEventForm';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { EventAPI, StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';
import { GetServerSideProps } from 'next';

interface EditPickupEventProps {
  user: PrivateProfile;
  token: string;
  futureEvents: PublicEvent[];
  pickupEvent: PublicOrderPickupEvent;
}
const EditPickupEventPage = ({
  user: { credits },
  token,
  futureEvents,
  pickupEvent,
}: EditPickupEventProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <AdminPickupEventForm
        mode="edit"
        token={token}
        upcomingEvents={futureEvents}
        defaultData={pickupEvent}
      />
    </div>
  );
};

export default EditPickupEventPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const [futureEvents, pickupEvent] = await Promise.all([
    EventAPI.getAllFutureEvents(),
    StoreAPI.getPickupEvent(token, uuid),
  ]);
  return { props: { token, futureEvents, pickupEvent } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  { redirectTo: config.admin.homeRoute }
);
