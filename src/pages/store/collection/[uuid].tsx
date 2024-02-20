import { Typography } from '@/components/common';
import { CreateButton, EditButton, HiddenIcon, ItemCard, Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from '@/styles/pages/StoreCollectionPage.module.scss';
import { GetServerSideProps } from 'next';

interface CollectionProps {
  uuid: string;
  user: PrivateProfile;
  collection: PublicMerchCollection;
  previewPublic: boolean;
}

const CollectionsPage = ({
  uuid,
  user: { credits, accessType },
  collection: { title, description, items = [], archived },
  previewPublic,
}: CollectionProps) => {
  const storeAdminVisible =
    PermissionService.canEditMerchItems.includes(accessType) && !previewPublic;

  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <div className={styles.header}>
        <Typography variant="h1/bold" component="h1">
          {title}
          {storeAdminVisible ? <EditButton type="collection" uuid={uuid} /> : null}
          {storeAdminVisible && archived ? <HiddenIcon type="collection" /> : null}
        </Typography>
        <Typography variant="h4/regular" component="p">
          {description}
        </Typography>
      </div>
      <div className={styles.collections}>
        {items
          .filter(item => storeAdminVisible || !item.hidden)
          .map(item => (
            <ItemCard
              image={getDefaultMerchItemPhoto(item)}
              title={item.itemName}
              href={`${config.store.itemRoute}${item.uuid}`}
              cost={item.options[0]?.price ?? 0}
              discountPercentage={item.options[0]?.discountPercentage ?? 0}
              outOfStock={item.options.every(option => option.quantity === 0)}
              key={item.uuid}
            >
              {storeAdminVisible && item.hidden ? <HiddenIcon type="item" /> : null}
              {storeAdminVisible ? <EditButton type="item" uuid={item.uuid} /> : null}
            </ItemCard>
          ))}
        {storeAdminVisible ? (
          <CreateButton type="item" collection={uuid}>
            Add an item
          </CreateButton>
        ) : null}
      </div>
    </div>
  );
};

export default CollectionsPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const preview = CookieService.getServerCookie(CookieType.USER_PREVIEW_ENABLED, { req, res });
  try {
    const collection = await StoreAPI.getCollection(token, uuid);
    return {
      props: {
        uuid,
        collection,
        previewPublic: preview === 'member',
      },
    };
  } catch {
    return { notFound: true };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes,
  { disableCaching: true }
);
