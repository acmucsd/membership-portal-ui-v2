import { ItemDetailsForm } from '@/components/admin/store';
import { Navbar } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import config from '@/lib/config';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection, PublicMerchItem } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/StoreItemEditPage.module.scss';

interface ItemEditPageProps {
  user: PrivateProfile;
  token: string;
  item: PublicMerchItem;
  collections: PublicMerchCollection[];
}
const ItemEditPage = ({ user: { credits }, token, item, collections }: ItemEditPageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <ItemDetailsForm mode="edit" defaultData={item} token={token} collections={collections} />
    </div>
  );
};

export default ItemEditPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ params, authToken: token }) => {
  const uuid = params?.uuid as string;
  try {
    const [item, collections] = await Promise.all([
      StoreAPI.getItem(token, uuid),
      StoreAPI.getAllCollections(token),
    ]);
    return { props: { title: `Edit ${item.itemName}`, token, item, collections } };
  } catch {
    return { notFound: true };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canEditMerchItems,
  { redirectTo: config.admin.homeRoute }
);
