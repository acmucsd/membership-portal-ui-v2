import { CartOptionsGroup, ItemHeader, Navbar, SizeSelector } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import config from '@/lib/config';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import {
  PrivateProfile,
  PublicMerchItemOption,
  PublicMerchItemWithPurchaseLimits,
} from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from '@/styles/pages/StoreItemPage.module.scss';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';

interface ItemPageProps {
  user: PrivateProfile;
  item: PublicMerchItemWithPurchaseLimits;
}

const StoreItemPage = ({ user: { credits }, item }: ItemPageProps) => {
  const [selectedOption, setSelectedOption] = useState<PublicMerchItemOption | null | undefined>(
    item.options.find(option => option.quantity > 0) ?? item.options[0] ?? null
  );
  const [inCart, setInCart] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);

  //   const currItemOption: PublicMerchItemOption | null | undefined =
  // item.options.find(val => val.metadata?.value === selectedOption?.value) ??
  // item.options.find(option => option.quantity > 0) ??
  // item.options[0] ??
  // null;

  return (
    <div className={styles.navbarBodyDiv}>
      <Navbar balance={credits} showBack />
      <div className={styles.rowContainer}>
        <div className={styles.coverContainer}>
          <Image
            style={{ objectFit: 'contain' }}
            src={getDefaultMerchItemPhoto(item)}
            alt={`Picture of ${item.itemName}`}
            fill
          />
        </div>
        <div className={styles.optionsContainer}>
          <ItemHeader itemName={item.itemName} cost={selectedOption?.price} />
          {item.options.length > 1 ? (
            <SizeSelector
              currOption={selectedOption?.metadata}
              onOptionChange={setSelectedOption}
              options={item.options}
            />
          ) : null}

          <CartOptionsGroup
            inCart={inCart}
            onCartChange={setInCart}
            currOption={selectedOption?.metadata?.value}
            inStock={selectedOption?.quantity != null && selectedOption?.quantity >= 1}
            lifetimeRemaining={item.lifetimeRemaining}
            monthlyRemaining={item.monthlyRemaining}
            amountToBuy={amount}
            onAmountChange={setAmount}
            optionsKey={selectedOption?.metadata.type}
          />
          <h4>Item Description</h4>
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
  PermissionService.allUserTypes
);

// Knowledge:
// useState typing: https://stackoverflow.com/questions/72016031/how-to-set-type-of-variable-on-usestate-using-typescript#:~:text=You%20just%20need%20to%20specify%20the%20type%20of,const%20%5B%20text%2C%20setText%20%5D%20%3D%20useState%20%28%27%27%29%3B
// State Sharing: https://react.dev/learn/sharing-state-between-components
