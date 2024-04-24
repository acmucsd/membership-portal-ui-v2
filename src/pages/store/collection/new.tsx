import { CollectionDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';

interface CreateCollectionPageProps {
  user: PrivateProfile;
  token: string;
  item: PublicMerchCollection | null;
}
const CreateCollectionPage = ({ user: { credits }, token, item }: CreateCollectionPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <CollectionDetailsForm mode="create" defaultData={item ?? undefined} token={token} />
    </div>
  );
};

export default CreateCollectionPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ query, authToken: token }) => {
  const item =
    typeof query.duplicate === 'string'
      ? await StoreAPI.getCollection(token, query.duplicate)
      : null;
  return { props: { title: 'Create Collection', token, item } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  { redirectTo: config.admin.homeRoute }
);
