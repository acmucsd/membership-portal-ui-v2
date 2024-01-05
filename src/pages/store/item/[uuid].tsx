import { Navbar } from '@/components/store';
import AddCartButton from '@/components/store/AddCartButton';
import ItemHeader from '@/components/store/ItemHeader';
import SizeSelector from '@/components/store/SizeSelector';
import { StoreAPI } from '@/lib/api';
import config from '@/lib/config';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchItemWithPurchaseLimits } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from '@/styles/pages/store/item.module.scss';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';

interface ItemPageProps {
  user: PrivateProfile;

  item: PublicMerchItemWithPurchaseLimits;
}
const StoreItemPage = ({ user: { credits }, item }: ItemPageProps) => {
  const [size, setSize] = useState<string | undefined>(item.options.length <= 1 ? 'Y' : undefined);
  const [inCart, setInCart] = useState<boolean>(false);

  const currOption =
    item.options.length <= 1
      ? item.options[0]
      : item.options.find(val => val.metadata?.value === size);

  return (
    <div className={styles.navbarBodyDiv}>
      <Navbar balance={credits} showBack />
      <div className={styles.rowContainer}>
        <Image
          src={getDefaultMerchItemPhoto(item)}
          alt={`Picture of ${item.itemName}`}
          width={600}
          height={600}
        />
        <div className={styles.optionsContainer}>
          <ItemHeader itemName={item.itemName} cost={currOption?.price} />
          {item.options.length > 1 ? (
            <SizeSelector
              currSize={size}
              onSizeChange={setSize}
              options={item.options}
              uuid={item.uuid}
            />
          ) : null}

          <AddCartButton
            inCart={inCart}
            onCartChange={setInCart}
            currSize={size}
            inStock={currOption?.quantity != null && currOption?.quantity >= 1}
            lifetimeRemaining={item.lifetimeRemaining}
            monthlyRemaining={item.monthlyRemaining}
          />
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreItemPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const item = await StoreAPI.getItem(uuid, token);
    return {
      props: {
        item,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.store.homeRoute, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);

// Knowledge:
// useState typing: https://stackoverflow.com/questions/72016031/how-to-set-type-of-variable-on-usestate-using-typescript#:~:text=You%20just%20need%20to%20specify%20the%20type%20of,const%20%5B%20text%2C%20setText%20%5D%20%3D%20useState%20%28%27%27%29%3B
// State Sharing: https://react.dev/learn/sharing-state-between-components
