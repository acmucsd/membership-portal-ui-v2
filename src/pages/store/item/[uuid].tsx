import { Typography } from '@/components/common';
import { CartOptionsGroup, ItemHeader, Navbar, SizeSelector } from '@/components/store';
import { config, showToast } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { CartService, CookieService, PermissionService } from '@/lib/services';
import {
  PrivateProfile,
  PublicMerchItemOption,
  PublicMerchItemWithPurchaseLimits,
} from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import NoImage from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/StoreItemPage.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

interface ItemPageProps {
  uuid: string;
  user: PrivateProfile;
  item: PublicMerchItemWithPurchaseLimits;
  previewPublic: boolean;
}

const StoreItemPage = ({
  uuid,
  user: { credits, accessType },
  item,
  previewPublic,
}: ItemPageProps) => {
  const router = useRouter();
  // Sort options and photos according to their posiiton
  const options = useMemo(
    () =>
      [...item.options].sort((a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0)),
    [item]
  );
  const photos = useMemo(
    () => [...item.merchPhotos].sort((a, b) => a.position - b.position),
    [item]
  );

  const storeAdminVisible =
    PermissionService.canEditMerchItems.includes(accessType) && !previewPublic;
  const [selectedOption, setSelectedOption] = useState<PublicMerchItemOption | undefined>(
    options.find(option => option.quantity > 0) ?? options[0]
  );
  const [photoIndex, setPhotoIndex] = useState(0);
  const id = useId();

  return (
    <div className={styles.navbarBodyDiv}>
      <Navbar balance={credits} showBack />
      <div className={styles.rowContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.coverContainer}>
            <div className={styles.cover}>
              <Image
                src={photos[photoIndex]?.uploadedPhoto ?? NoImage.src}
                alt={`Picture of ${item.itemName}`}
                fill
              />
            </div>
          </div>
          {photos.length > 1 ? (
            <div className={styles.images}>
              {photos.map((photo, i) => (
                <label
                  className={`${styles.image} ${i === photoIndex ? styles.selected : ''}`}
                  key={photo.uuid}
                >
                  <input type="radio" name={id} onClick={() => setPhotoIndex(i)} />
                  <Image src={photo.uploadedPhoto} alt={`Picture of ${item.itemName}`} fill />
                </label>
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.optionsContainer}>
          <ItemHeader
            itemName={item.itemName}
            cost={selectedOption?.price}
            discountPercentage={selectedOption?.discountPercentage ?? 0}
            uuid={uuid}
            showEdit={storeAdminVisible}
            isHidden={storeAdminVisible && item.hidden}
          />
          {options.length > 1 ? (
            <SizeSelector
              currOption={selectedOption?.metadata ?? undefined}
              onOptionChange={setSelectedOption}
              options={options}
            />
          ) : null}

          <CartOptionsGroup
            onAddToCart={amount => {
              // TEMP
              if (selectedOption?.uuid) {
                CartService.addItem(item, selectedOption, amount);
                showToast(`Added ${item.itemName} to your cart!`, '', [
                  {
                    text: 'View Cart',
                    onClick: () => router.push(config.store.cartRoute),
                  },
                ]);
              }
            }}
            currOption={selectedOption?.metadata?.value}
            lifetimeRemaining={item.lifetimeRemaining}
            monthlyRemaining={item.monthlyRemaining}
            available={selectedOption?.quantity ?? 0}
            optionsKey={selectedOption?.metadata?.type}
            hidden={item.hidden}
          />
          <Typography variant="h4/bold">Item Description</Typography>
          <Typography
            variant="h5/regular"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {item.description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default StoreItemPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({
  params,
  req,
  res,
  authToken,
}) => {
  const uuid = params?.uuid as string;
  const preview = CookieService.getServerCookie(CookieType.USER_PREVIEW_ENABLED, { req, res });

  try {
    const item = await StoreAPI.getItem(authToken, uuid);
    return {
      props: {
        title: item.itemName,
        description: item.description,
        previewImage: getDefaultMerchItemPhoto(item),
        uuid,
        item,
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

// Knowledge:
// useState typing: https://stackoverflow.com/questions/72016031/how-to-set-type-of-variable-on-usestate-using-typescript#:~:text=You%20just%20need%20to%20specify%20the%20type%20of,const%20%5B%20text%2C%20setText%20%5D%20%3D%20useState%20%28%27%27%29%3B
// State Sharing: https://react.dev/learn/sharing-state-between-components
