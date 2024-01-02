import { Button, Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { Diamonds, Navbar } from '@/components/store';
import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import { getItem } from '@/lib/api/StoreAPI';
import { getCurrentUser } from '@/lib/api/UserAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import { getServerCookie, setClientCookie, setServerCookie } from '@/lib/services/CookieService';
import { allUserTypes } from '@/lib/services/PermissionService';
import { UUID } from '@/lib/types';
import {
  PrivateProfile,
  PublicEvent,
  PublicMerchItem,
  PublicMerchItemOption,
} from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { toSentenceCase } from '@/lib/utils';
import ArrowLeft from '@/public/assets/icons/arrow-left.svg';
import ArrowRight from '@/public/assets/icons/arrow-right.svg';
import EmptyCartIcon from '@/public/assets/icons/empty-cart.svg';
import styles from '@/styles/pages/store/cart/index.module.scss';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CookieCartItem {
  itemUUID: string;
  optionUUID: string;
  quantity: number;
}

/**
 * Similar to PublicCartItem but holds exactly one option
 */
interface ClientCartItem extends Omit<PublicMerchItem, 'options'> {
  option: PublicMerchItemOption;
  quantity: number;
}

interface CartPageProps {
  user: PrivateProfile;
  savedCart: ClientCartItem[];
  pickupEvents: PublicEvent[];
  token: string;
}

enum CartState {
  PRECHECKOUT,
  CONFIRMING,
  CONFIRMED,
}

const clientCartToCookie = (items: ClientCartItem[]): string =>
  JSON.stringify(
    items.map(item => ({
      itemUUID: item.uuid,
      optionUUID: item.option.uuid,
      quantity: item.quantity,
    }))
  );

const StoreCartItem = ({
  item,
  removeItem,
}: {
  item: ClientCartItem;
  removeItem(optionUUID: UUID): void;
}) => {
  const itemPage = `${config.itemRoute}${item.uuid}`;

  return (
    <div className={styles.cartItem}>
      {item.merchPhotos?.[0] && (
        <Link href={itemPage}>
          <Image
            src={item.merchPhotos[0].uploadedPhoto}
            alt={item.itemName}
            width={150}
            height={150}
          />
        </Link>
      )}
      <div className={styles.cartItemInfo}>
        <Link href={itemPage}>
          <Typography variant="h4/medium" component="h3">
            {item.itemName}
          </Typography>
        </Link>
        {item.option.metadata && (
          <Typography variant="h5/bold" component="p">
            {toSentenceCase(item.option.metadata?.type)}&nbsp;
            <Typography variant="h5/regular" component="span">
              {item.option.metadata?.value}
            </Typography>
          </Typography>
        )}
        <Typography variant="h5/bold" component="p">
          Quantity:&nbsp;
          <Typography variant="h5/regular" component="span">
            {item.quantity}
          </Typography>
        </Typography>
        {/* // todo onclick for remove item button */}
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => removeItem(item.option.uuid)}
        >
          <Typography variant="h5/regular" component="span">
            Remove Item
          </Typography>
        </button>
      </div>
      <Diamonds count={item.option?.price ?? 0} className={styles.cartItemPrice} />
    </div>
  );
};

const StoreCartPage = ({ user, savedCart, pickupEvents, token }: CartPageProps) => {
  useEffect(() => {
    console.log(user);
    console.log(cart);
    console.log(pickupEvents);
  });
  const { credits } = user;

  const calculateOrderTotal = (cart: ClientCartItem[]): number => {
    return cart.reduce((total, { quantity, option: { price } }) => total + quantity * price, 0);
  };

  const [cart, setCart] = useState(savedCart);
  const [pickupIndex, setPickupIndex] = useState(0);
  const [cartState, setCartState] = useState(CartState.PRECHECKOUT);
  const [orderTotal, setOrderTotal] = useState(calculateOrderTotal(savedCart));

  // update the cart cookie
  useEffect(() => {
    setOrderTotal(calculateOrderTotal(cart));
    setClientCookie('CART', clientCartToCookie(cart));
    console.log('cart', cart);
  }, [cart, credits]);

  const removeItem = (optionUUID: UUID) => {
    setCart(cart => cart.filter(item => item.option.uuid !== optionUUID));
  };

  return (
    <div className={styles.container}>
      <Navbar balance={credits} />
      <div className={styles.content}>
        <Typography variant="h1/bold" component="h1">
          Your Cart
        </Typography>
        {cart.length === 0 && cartState !== CartState.CONFIRMED ? (
          <div />
        ) : (
          <button
            type="button"
            className={`${styles.checkoutButton} ${
              cartState === CartState.CONFIRMING ? styles.confirming : ''
            }`}
            onClick={() => {
              if (cartState === CartState.PRECHECKOUT) {
                setCartState(CartState.CONFIRMING);
              } else {
                (() => {})();
              }
            }}
            disabled={orderTotal > credits}
          >
            Place Order
          </button>
        )}
        {/* Cart Items */}
        <div>
          <div className={styles.cartSection}>
            <div className={styles.cartHeader}>
              <Typography variant="h4/bold" component="h2">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
              </Typography>
            </div>
            {cart.map(item => (
              <StoreCartItem key={item.option.uuid} item={item} removeItem={removeItem} />
            ))}
            {cart.length === 0 && (
              <div className={styles.emptyCart}>
                <EmptyCartIcon />
                <Typography variant="h6/regular" component="p">
                  Your cart is empty. Visit the ACM Store to add items!
                </Typography>
                <Link href={config.storeRoute}>
                  <Button onClick={() => {}}>Go to Store</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className={styles.sidebar}>
          {cart.length > 0 && orderTotal <= credits && cartState !== CartState.CONFIRMED && (
            <div className={`${styles.cartSection} ${styles.pickupSection}`}>
              <div className={styles.cartHeader}>
                <Typography variant="h4/bold" component="h2">
                  Choose Pickup Event
                </Typography>
              </div>
              <div className={styles.temp2}>
                <div
                  className={styles.temp}
                  style={{ transform: `translateX(${-320 * pickupIndex}px)` }}
                >
                  {pickupEvents.map(event => (
                    <EventCard key={event.uuid} event={event} attended={false} />
                  ))}
                </div>
              </div>

              {/* <EventCard event={pickupEvents[pickupIndex]} /> */}
              <div className={styles.eventNavigation}>
                <button
                  type="button"
                  onClick={() => setPickupIndex(i => (i > 0 ? i - 1 : 0))}
                  aria-label="Previous Event"
                  disabled={pickupIndex <= 0}
                >
                  <ArrowLeft />
                </button>
                <Typography variant="h5/regular" component="p">{`${pickupIndex + 1}/${
                  pickupEvents.length
                }`}</Typography>
                <button
                  type="button"
                  onClick={() => setPickupIndex(i => Math.min(i + 1, pickupEvents.length - 1))}
                  aria-label="Next Event"
                  disabled={pickupIndex >= pickupEvents.length - 1}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          )}

          <div className={`${styles.cartSection}`}>
            <div className={styles.cartHeader}>
              <Typography variant="h4/bold" component="h2">
                Membership Points
              </Typography>
            </div>
            <div className={styles.pointsSection}>
              <div>
                <Typography variant="h5/bold" component="p">
                  Current Balance
                </Typography>
                <Diamonds count={credits} />
              </div>
              <div>
                <Typography variant="h5/bold" component="p">
                  Order Total
                </Typography>
                <div>
                  - <Diamonds count={orderTotal} />
                </div>
              </div>
              <hr />
              <div>
                <Typography variant="h5/bold" component="p">
                  Remaining Balance
                </Typography>
                <Diamonds count={credits - orderTotal} />
              </div>
            </div>
          </div>
          {credits < orderTotal && (
            <Typography variant="h5/regular" component="p" className={styles.warning}>
              You do not have enough membership points to checkout. Earn more membership points by
              attending ACM events!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCartPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  //* temp
  const FAKE_CART = [
    {
      itemUUID: '1dc46f8b-1481-4dac-a3ff-b835c3d6de2b',
      optionUUID: 'cb43ed73-7a06-4131-97c2-149cb2866816',
      quantity: 2,
    },
    {
      itemUUID: '18d76c1d-0d77-40a5-81cf-a7438e89a117',
      optionUUID: 'b019f7e4-3585-4fca-8090-33faffe8c195',
      quantity: 1,
    },
    {
      itemUUID: '17774f20-e04d-4ace-a6fc-8dfe9286eca7',
      optionUUID: 'd75f35b3-e452-46ea-a58b-2a2e010e6ff9',
      quantity: 1,
    },
  ];

  const AUTH_TOKEN = getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  // recover saved items and reset cart to [] if it's invalid
  let savedItems;
  try {
    const cartCookie = getServerCookie('CART', { req, res });
    savedItems = JSON.parse(cartCookie);
    if (!Array.isArray(savedItems)) throw new Error();
  } catch {
    // savedItems = [];
    savedItems = FAKE_CART;
  }

  const savedCartPromises = Promise.all(
    savedItems.map(async ({ itemUUID, optionUUID, quantity }: CookieCartItem) => {
      try {
        const { options, ...publicItem } = await getItem(AUTH_TOKEN, itemUUID);

        // form the ClientCartItem from the PublicMerchItem
        const ClientCartItem: Partial<ClientCartItem> = { ...publicItem, quantity };
        ClientCartItem.option = options.find(option => option.uuid === optionUUID);

        // check for invalid cart cookie item
        if (!ClientCartItem.option || typeof quantity !== 'number') throw new Error();
        return ClientCartItem as ClientCartItem;
      } catch {
        return undefined;
      }
    })
  ).then((items): ClientCartItem[] => items.filter(item => item !== undefined) as ClientCartItem[]);

  // TODO: replace placeholder events with pickup events
  const pickupEventsPromise = EventAPI.getAllFutureEvents();
  const userPromise = getCurrentUser(AUTH_TOKEN);

  // gather the API request promises and await them concurrently
  const [savedCart, pickupEvents, user] = await Promise.all([
    savedCartPromises,
    pickupEventsPromise,
    userPromise,
  ]);

  // update the cart cookie if part of it was malformed
  setServerCookie('CART', clientCartToCookie(savedCart), { req, res });

  console.log(user, pickupEvents);

  return {
    props: {
      user,
      savedCart,
      pickupEvents,
      token: AUTH_TOKEN,
    },
  };
};

export const getServerSideProps = withAccessType(getServerSidePropsFunc, allUserTypes());
