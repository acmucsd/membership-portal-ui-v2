import { ItemDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection, PublicMerchItem } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';
import { GetServerSideProps } from 'next';

interface CreateItemPageProps {
  user: PrivateProfile;
  item: PublicMerchItem;
  collections: PublicMerchCollection[];
}
const CreateItemPage = ({ user: { credits }, item, collections }: CreateItemPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <ItemDetailsForm mode="create" defaultData={item} collections={collections} />
    </div>
  );
};

export default CreateItemPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const [item, collections] = await Promise.all([
    typeof query.duplicate === 'string'
      ? StoreAPI.getItem(query.duplicate, token)
      : { collection: typeof query.collection === 'string' ? query.collection : undefined },
    StoreAPI.getAllCollections(token),
  ]);
  return { props: { item, collections } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  config.admin.homeRoute
);
