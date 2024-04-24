import { Typography } from '@/components/common';
import { CreateButton, HiddenIcon, ItemCard, Navbar, StoreEditButton } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreCollectionPage.module.scss';
import Image from 'next/image';
import { useMemo } from 'react';

interface CollectionProps {
  uuid: string;
  user: PrivateProfile;
  collection: PublicMerchCollection;
  previewPublic: boolean;
}

const CollectionsPage = ({
  uuid,
  user: { credits, accessType },
  collection: { title, description, items = [], archived, collectionPhotos },
  previewPublic,
}: CollectionProps) => {
  const storeAdminVisible =
    PermissionService.canEditMerchItems.includes(accessType) && !previewPublic;

  const photos = useMemo(
    () => [...collectionPhotos].sort((a, b) => a.position - b.position),
    [collectionPhotos]
  );

  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <div className={styles.header}>
        <Typography variant="h1/bold" component="h1">
          {title}
          {storeAdminVisible ? <StoreEditButton type="collection" uuid={uuid} /> : null}
          {storeAdminVisible && archived ? <HiddenIcon type="collection" /> : null}
        </Typography>
        <Typography variant="h4/regular" component="p">
          {description}
        </Typography>
      </div>
      {photos.length > 0 ? (
        <>
          <div className={styles.photos}>
            {photos.map(photo => (
              <div className={styles.photo} key={photo.uuid}>
                <Image src={photo.uploadedPhoto} alt={`Photo of ${title}`} fill />
              </div>
            ))}
          </div>
          <Typography variant="h2/bold" component="h2" className={styles.browseItems}>
            Browse items
          </Typography>
        </>
      ) : null}
      <div className={styles.collections}>
        {items
          .filter(item => storeAdminVisible || !item.hidden)
          .map(item => (
            <ItemCard
              images={[...item.merchPhotos]
                .sort((a, b) => a.position - b.position)
                .map(photo => photo.uploadedPhoto)}
              title={item.itemName}
              href={`${config.store.itemRoute}${item.uuid}`}
              cost={item.options[0]?.price ?? 0}
              discountPercentage={item.options[0]?.discountPercentage ?? 0}
              outOfStock={item.options.every(option => option.quantity === 0)}
              key={item.uuid}
            >
              {storeAdminVisible && item.hidden ? <HiddenIcon type="item" /> : null}
              {storeAdminVisible ? <StoreEditButton type="item" uuid={item.uuid} /> : null}
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

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({
  params,
  req,
  res,
  authToken,
}) => {
  const uuid = params?.uuid as string;
  const preview = CookieService.getServerCookie(CookieType.USER_PREVIEW_ENABLED, { req, res });
  try {
    const collection = await StoreAPI.getCollection(authToken, uuid);
    return {
      props: {
        title: collection.title,
        description: collection.description,
        previewImage: getDefaultMerchCollectionPhoto(collection),
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
  PermissionService.allUserTypes
);
