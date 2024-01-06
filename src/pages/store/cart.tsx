import { Button, Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { CartItemCard, Diamonds, Navbar, PickupEventPicker, StoreModal } from '@/components/store';
import { config } from '@/lib';
import { getAllFutureEvents } from '@/lib/api/EventAPI';
import { getItem } from '@/lib/api/StoreAPI';
import { getCurrentUser } from '@/lib/api/UserAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import { getServerCookie, setClientCookie, setServerCookie } from '@/lib/services/CookieService';
import { allUserTypes } from '@/lib/services/PermissionService';
import { UUID } from '@/lib/types';
import { PrivateProfile, PublicEvent } from '@/lib/types/apiResponses';
import { ClientCartItem, CookieCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import EmptyCartIcon from '@/public/assets/icons/empty-cart.svg';
import styles from '@/styles/pages/store/cart/index.module.scss';
import utilStyles from '@/styles/utils.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

const StoreCartPage = ({ user, savedCart, pickupEvents, token }: CartPageProps) => {
  const { credits } = user;

  const calculateOrderTotal = (cart: ClientCartItem[]): number => {
    return cart.reduce((total, { quantity, option: { price } }) => total + quantity * price, 0);
  };

  const [cart, setCart] = useState(savedCart);
  const [pickupIndex, setPickupIndex] = useState(0);
  const [cartState, setCartState] = useState(CartState.PRECHECKOUT);
  const [orderTotal, setOrderTotal] = useState(calculateOrderTotal(savedCart));

  // update the cart cookie and order total
  useEffect(() => {
    setOrderTotal(calculateOrderTotal(cart));
    setClientCookie('CART', clientCartToCookie(cart));
  }, [cart, credits]);

  // prop for item cards to remove their item
  const removeItem = (optionUUID: UUID) => {
    setCart(cart => cart.filter(item => item.option.uuid !== optionUUID));
  };

  // in a useMemo since its location changes in mobile
  const EventPickerCard = useMemo(
    () => (
      <div className={styles.cartCard}>
        <div className={styles.header}>
          <Typography variant="h4/bold" component="h2">
            {cartState !== CartState.CONFIRMED ? 'Choose Pickup Event' : 'Pickup Event Details'}
          </Typography>
        </div>
        <PickupEventPicker
          events={pickupEvents}
          eventIndex={pickupIndex}
          setEventIndex={setPickupIndex}
          active={cartState !== CartState.CONFIRMED}
        />
      </div>
    ),
    [pickupEvents, pickupIndex, setPickupIndex, cartState]
  );

  // in a useMemo since its location changes in mobile
  const Warning = useMemo(
    () =>
      credits < orderTotal && (
        <Typography variant="h5/regular" component="p" className={styles.warning}>
          You do not have enough membership points to checkout. Earn more membership points by
          attending ACM events!
        </Typography>
      ),
    [credits, orderTotal]
  );

  return (
    <div className={styles.container}>
      <Navbar balance={credits} />
      <div className={styles.content}>
        {/* Title */}
        <Typography variant="h1/bold" component="h1">
          {cartState !== CartState.CONFIRMED ? 'Your Cart' : 'Order Confirmation'}
        </Typography>

        {/* Place Order Button */}
        {cart.length > 0 && cartState !== CartState.CONFIRMED ? (
          <StoreModal
            title="Please confirm you can pick up your order at this event:"
            opener={
              <button
                type="button"
                className={`${styles.checkoutButton} ${
                  cartState === CartState.CONFIRMING ? styles.confirming : ''
                }`}
                onClick={() => {
                  setCartState(CartState.CONFIRMING);
                }}
                disabled={orderTotal > credits}
              >
                <Typography variant="h4/bold" component="span">
                  Place Order
                </Typography>
              </button>
            }
            onConfirm={() => setCartState(CartState.CONFIRMED)}
            onCancel={() => setCartState(CartState.PRECHECKOUT)}
          >
            {pickupEvents[pickupIndex] && (
              <EventCard event={pickupEvents[pickupIndex] as PublicEvent} attended={false} />
            )}
          </StoreModal>
        ) : (
          <div />
        )}

        {/* Main Quarter */}
        <div className={styles.main}>
          {cartState === CartState.CONFIRMED && (
            <div className={`${styles.cartCard} ${styles.confirmation}`}>
              <Typography variant="h3/regular" component="p">
                You will receive a confirmation email with your order details soon.
                <br />
                Please pick up your items on the date you selected. Thank you!
              </Typography>
              <div>
                <Link href={config.storeRoute}>
                  <button type="button">
                    <Typography variant="h5/bold" component="span">
                      Continue Shopping
                    </Typography>
                  </button>
                </Link>
                <Link href={config.myOrdersRoute}>
                  <button type="button">
                    <Typography variant="h5/bold" component="span">
                      My Orders
                    </Typography>
                  </button>
                </Link>
              </div>
            </div>
          )}
          <div className={utilStyles.shownMobile}>
            {Warning}
            {cart.length > 0 && orderTotal <= credits && EventPickerCard}
          </div>

          <div className={styles.cartCard}>
            <div className={styles.header}>
              <Typography variant="h4/bold" component="h2">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
              </Typography>
            </div>
            {cart.map(item => (
              <CartItemCard
                key={item.option.uuid}
                item={item}
                removeItem={removeItem}
                removable={cartState !== CartState.CONFIRMED}
              />
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

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {cart.length > 0 && orderTotal <= credits && (
            <div className={utilStyles.shownDesktop}>{EventPickerCard}</div>
          )}
          <div className={styles.cartCard}>
            <Typography variant="h4/bold" component="h2" className={styles.header}>
              {cartState !== CartState.CONFIRMED ? 'Membership Points' : 'Balance Details'}
            </Typography>
            <div className={styles.pointsSection}>
              <div>
                <Typography variant="h5/bold" component="p">
                  {cartState !== CartState.CONFIRMED ? 'Current' : 'Previous'} Balance
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
          <div className={utilStyles.shownDesktop} style={{ marginTop: '2rem' }}>
            {Warning}
          </div>
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
  const pickupEventsPromise = getAllFutureEvents();
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
