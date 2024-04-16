import { CollectionDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import config from '@/lib/config';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';
import { GetServerSideProps } from 'next';

interface CollectionEditPageProps {
  user: PrivateProfile;
  token: string;
  collection: PublicMerchCollection;
}
const CollectionEditPage = ({ user: { credits }, token, collection }: CollectionEditPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <CollectionDetailsForm mode="edit" defaultData={collection} token={token} />
    </div>
  );
};

export default CollectionEditPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const collection = await StoreAPI.getCollection(token, uuid);
    return { props: { title: `Edit ${collection.title}`, token, collection } };
  } catch {
    return { notFound: true };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  { redirectTo: config.admin.homeRoute }
);
