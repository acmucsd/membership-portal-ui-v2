// reference /store/item/new page

import AdminPickupEventForm from '@/components/admin/event/AdminPickupEvent/AdminPickupEventForm';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';
import { GetServerSideProps } from 'next';

interface CreatePickupEventPageProps {
  user: PrivateProfile;
  token: string;
  futureEvents: PublicEvent[];
}
const CreatePickupEventPage = ({
  user: { credits },
  token,
  futureEvents,
}: CreatePickupEventPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <AdminPickupEventForm mode="create" token={token} upcomingEvents={futureEvents} />
    </div>
  );
};

export default CreatePickupEventPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const futureEvents = await EventAPI.getAllFutureEvents();
  return { props: { token, futureEvents } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  { redirectTo: config.admin.homeRoute }
);
