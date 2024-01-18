import { ItemDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchItem } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';
import { GetServerSideProps } from 'next';

interface CreateItemPageProps {
  user: PrivateProfile;
  item: PublicMerchItem;
}
const CreateItemPage = ({ user: { credits }, item }: CreateItemPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <ItemDetailsForm mode="create" defaultData={item} />
    </div>
  );
};

export default CreateItemPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  if (typeof query.duplicate === 'string') {
    const item = await StoreAPI.getItem(query.duplicate, token);
    return {
      props: { item },
    };
  }
  return {
    props: { defaultData: {} },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents,
  config.admin.homeRoute
);
