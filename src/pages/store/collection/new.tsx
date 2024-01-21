import { CollectionDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';
import { GetServerSideProps } from 'next';

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

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const item =
    typeof query.duplicate === 'string'
      ? await StoreAPI.getCollection(token, query.duplicate)
      : null;
  return { props: { token, item } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  config.admin.homeRoute
);
