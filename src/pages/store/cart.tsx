import { Typography } from '@/components/common';
import EventDetail from '@/components/events/EventDetail';
import {
  CartItemCard,
  Diamonds,
  Navbar,
  PickupEventPicker,
  StoreConfirmModal,
} from '@/components/store';
import { config, showToast } from '@/lib';
import { getFutureOrderPickupEvents, getItem, placeMerchOrder } from '@/lib/api/StoreAPI';
import { getCurrentUserAndRefreshCookie } from '@/lib/api/UserAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import {
  getClientCookie,
  getServerCookie,
  setClientCookie,
  setServerCookie,
} from '@/lib/services/CookieService';
import { loggedInUser } from '@/lib/services/PermissionService';
import type { UUID } from '@/lib/types';
import {
  PrivateProfile,
  PublicMerchItemOption,
  PublicOrderPickupEvent,
  PublicOrderPickupEventWithLinkedEvent,
} from '@/lib/types/apiResponses';
import { ClientCartItem, CookieCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import { getMessagesFromError, validateClientCartItem } from '@/lib/utils';
import EmptyCartIcon from '@/public/assets/icons/empty-cart.svg';
import styles from '@/styles/pages/store/cart/index.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface CartPageProps {
  user: PrivateProfile;
  savedCart: ClientCartItem[];
  pickupEvents: PublicOrderPickupEventWithLinkedEvent[];
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

const calculateOrderTotal = (cart: ClientCartItem[]): number => {
  return cart.reduce((total, { quantity, option: { price } }) => total + quantity * price, 0);
};

const StoreCartPage = ({ user: { credits }, savedCart, pickupEvents }: CartPageProps) => {
  const [cart, setCart] = useState(savedCart);
  const [pickupIndex, setPickupIndex] = useState(0);
  const [cartState, setCartState] = useState(CartState.PRECHECKOUT);
  const [orderTotal, setOrderTotal] = useState(calculateOrderTotal(savedCart));
  const [liveCredits, setLiveCredits] = useState(credits);

  // update the cart cookie and order total
  useEffect(() => {
    setOrderTotal(calculateOrderTotal(cart));
    setClientCookie(CookieType.CART, clientCartToCookie(cart));
  }, [cart, credits]);

  const cartInvalid = useMemo(() => cart.some(item => validateClientCartItem(item)), [cart]);

  // prop for item cards to remove their item
  const removeItem = (optionUUID: UUID) => {
    setCart(cart => cart.filter(item => item.option.uuid !== optionUUID));
  };

  // handle confirming an order
  const placeOrder = () =>
    placeMerchOrder(getClientCookie(CookieType.ACCESS_TOKEN), {
      order: cart.map(({ option: { uuid }, quantity }) => ({
        option: uuid,
        quantity,
      })),
      pickupEvent: pickupEvents[pickupIndex]?.uuid ?? 'x',
    })
      .then(({ items, pickupEvent }) => {
        showToast(
          `Order with ${items.length} item${items.length === 1 ? '' : 's'} placed`,
          `Pick up at ${pickupEvent.title}`
        );
        setCartState(CartState.CONFIRMED);
        setClientCookie(CookieType.CART, clientCartToCookie([]));
        setLiveCredits(credits - orderTotal);
      })
      .catch(err => {
        showToast('Unable to place order', getMessagesFromError(err.response.data.error).join());
      });

  return (
    <div className={styles.container}>
      <Navbar balance={liveCredits} />
      <div className={styles.content}>
        {/* Title */}
        <Typography variant="h1/bold" component="h1" className={styles.title}>
          {cartState !== CartState.CONFIRMED ? 'Your Cart' : 'Order Confirmation'}
        </Typography>

        {/* Place Order Button */}
        {cart.length > 0 && cartState !== CartState.CONFIRMED ? (
          <StoreConfirmModal
            title="Please confirm you can pick up your order at this event:"
            opener={
              <button
                type="button"
                className={`${styles.placeOrder} ${
                  cartState === CartState.CONFIRMING ? styles.confirming : ''
                }`}
                onClick={() => {
                  setCartState(CartState.CONFIRMING);
                }}
                disabled={orderTotal > credits || pickupEvents.length === 0 || cartInvalid}
              >
                <Typography variant="h4/bold" component="span">
                  Place Order
                </Typography>
              </button>
            }
            onConfirm={placeOrder}
            onCancel={() => setCartState(CartState.PRECHECKOUT)}
          >
            {pickupEvents[pickupIndex] && (
              <EventDetail
                event={pickupEvents[pickupIndex] as PublicOrderPickupEvent}
                attended={false}
                inModal={false}
              />
            )}
          </StoreConfirmModal>
        ) : (
          <div />
        )}

        {/* Confirmation */}
        {cartState === CartState.CONFIRMED ? (
          <div className={`${styles.cartCard} ${styles.confirmation}`}>
            <Typography variant="h3/regular" component="p">
              You will receive a confirmation email with your order details soon.
              <br />
              Please pick up your items on the date you selected. Thank you!
            </Typography>
            <div>
              <Link href={config.storeRoute}>
                <button type="button" className={styles.storeButton}>
                  <Typography variant="h5/bold" component="span">
                    Continue Shopping
                  </Typography>
                </button>
              </Link>
              <Link href={config.myOrdersRoute}>
                <button type="button" className={styles.storeButton}>
                  <Typography variant="h5/bold" component="span">
                    My Orders
                  </Typography>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* Items */}
        <div className={`${styles.cartCard} ${styles.items}`}>
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
                <button type="button" className={styles.storeButton}>
                  <Typography variant="h5/medium" component="span">
                    Go to Store
                  </Typography>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Event Picker */}
        {((cart.length > 0 && credits >= orderTotal && !cartInvalid) ||
          cartState === CartState.CONFIRMED) && (
          <div className={`${styles.cartCard} ${styles.eventPicker}`}>
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
        )}

        {/* Points Summary */}
        <div className={`${styles.cartCard} ${styles.pointsCard}`}>
          <Typography variant="h4/bold" component="h2" className={styles.header}>
            {cartState !== CartState.CONFIRMED ? 'Membership Points' : 'Balance Details'}
          </Typography>
          <div className={styles.points}>
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
        <div className={styles.warning}>
          {credits < orderTotal && (
            <Typography variant="h5/regular" component="p">
              You do not have enough membership points to checkout. Earn more membership points by
              attending ACM events!
            </Typography>
          )}
          {cartInvalid && (
            <Typography variant="h5/regular" component="p">
              Some items in your cart are not available. Remove them to check out!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCartPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const AUTH_TOKEN = getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  // recover saved items and reset cart to [] if it's invalid
  let savedItems;
  try {
    const cartCookie = getServerCookie(CookieType.CART, { req, res });
    savedItems = JSON.parse(cartCookie);
    if (!Array.isArray(savedItems)) throw new Error();
  } catch {
    savedItems = [];
  }

  const savedCartPromises = Promise.all(
    savedItems.map(async ({ itemUUID, optionUUID, quantity }: CookieCartItem) => {
      try {
        const { options, ...publicItem } = await getItem(AUTH_TOKEN, itemUUID);

        // form the ClientCartItem from the PublicMerchItem
        const ClientCartItem: Partial<ClientCartItem> = { ...publicItem, quantity };
        ClientCartItem.option = options.find(
          (option: PublicMerchItemOption) => option.uuid === optionUUID
        );

        // check for invalid cart cookie item
        if (!ClientCartItem.option || typeof quantity !== 'number') throw new Error();
        return ClientCartItem as ClientCartItem;
      } catch {
        return undefined;
      }
    })
  ).then((items): ClientCartItem[] => items.filter(item => item !== undefined) as ClientCartItem[]);

  const pickupEventsPromise = getFutureOrderPickupEvents(AUTH_TOKEN).then(events =>
    events.filter(event => event.status !== 'CANCELLED')
  );
  const userPromise = getCurrentUserAndRefreshCookie(AUTH_TOKEN, { req, res });

  // gather the API request promises and await them concurrently
  const [savedCart, pickupEvents, user] = await Promise.all([
    savedCartPromises,
    pickupEventsPromise,
    userPromise,
  ]);

  // update the cart cookie if part of it was malformed
  setServerCookie(CookieType.CART, clientCartToCookie(savedCart), { req, res });

  return {
    props: {
      user,
      savedCart,
      pickupEvents,
    },
  };
};

export const getServerSideProps = withAccessType(getServerSidePropsFunc, loggedInUser);
