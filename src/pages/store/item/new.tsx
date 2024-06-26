import { ItemDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection, PublicMerchItem } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';

interface CreateItemPageProps {
  user: PrivateProfile;
  token: string;
  item: PublicMerchItem | string | null;
  collections: PublicMerchCollection[];
}
const CreateItemPage = ({ user: { credits }, token, item, collections }: CreateItemPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <ItemDetailsForm
        mode="create"
        defaultData={item ?? undefined}
        token={token}
        collections={collections}
      />
    </div>
  );
};

export default CreateItemPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ query, authToken: token }) => {
  const [item, collections] = await Promise.all([
    typeof query.duplicate === 'string'
      ? StoreAPI.getItem(token, query.duplicate)
      : query.collection ?? null,
    StoreAPI.getAllCollections(token),
  ]);
  return { props: { title: 'Create Store Item', token, item, collections } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  { redirectTo: config.admin.homeRoute }
);
