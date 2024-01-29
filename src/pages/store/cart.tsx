import { Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { CartItemCard, Diamonds, Navbar, PickupEventPicker, StoreModal } from '@/components/store';
import { config, showToast } from '@/lib';
import { getAllFutureEvents } from '@/lib/api/EventAPI';
import { getFutureOrderPickupEvents, getItem, placeMerchOrder } from '@/lib/api/StoreAPI';
import { getCurrentUser } from '@/lib/api/UserAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import { getServerCookie, setClientCookie, setServerCookie } from '@/lib/services/CookieService';
import { loggedInUser } from '@/lib/services/PermissionService';
import { UUID } from '@/lib/types';
import { PrivateProfile, PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { ClientCartItem, CookieCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import { getMessagesFromError } from '@/lib/utils';
import EmptyCartIcon from '@/public/assets/icons/empty-cart.svg';
import styles from '@/styles/pages/store/cart/index.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartPageProps {
  user: PrivateProfile;
  savedCart: ClientCartItem[];
  pickupEvents: PublicOrderPickupEvent[];
  token: string;
  tempFakeEvents: PublicEvent[];
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

const StoreCartPage = ({
  user: { credits },
  savedCart,
  pickupEvents,
  token,
  tempFakeEvents,
}: CartPageProps) => {
  const calculateOrderTotal = (cart: ClientCartItem[]): number => {
    return cart.reduce((total, { quantity, option: { price } }) => total + quantity * price, 0);
  };

  const [cart, setCart] = useState(savedCart);
  const [pickupIndex, setPickupIndex] = useState(0);
  const [cartState, setCartState] = useState(CartState.PRECHECKOUT);
  const [orderTotal, setOrderTotal] = useState(calculateOrderTotal(savedCart));
  const [liveCredits, setLiveCredits] = useState(credits);

  // update the cart cookie and order total
  useEffect(() => {
    setOrderTotal(calculateOrderTotal(cart));
    setClientCookie('CART', clientCartToCookie(cart));
  }, [cart, credits]);

  // prop for item cards to remove their item
  const removeItem = (optionUUID: UUID) => {
    setCart(cart => cart.filter(item => item.option.uuid !== optionUUID));
  };

  // handle confirming an order
  const placeOrder = () =>
    placeMerchOrder(token, {
      order: cart.map(({ option: { uuid }, quantity }) => ({
        option: uuid,
        quantity,
      })),
      //* temp using first pickup event always
      pickupEvent: pickupEvents[0]?.uuid ?? 'xxx',
    })
      .then(({ items, pickupEvent }) => {
        showToast(
          `Order with ${items.length} item${items.length === 1 ? '' : 's'} placed`,
          `Pick up at ${pickupEvent.title}`
        );
        setCartState(CartState.CONFIRMED);
        setClientCookie('CART', clientCartToCookie([]));
        setLiveCredits(credits - orderTotal);
      })
      .catch(err => {
        showToast('Unable to place order', getMessagesFromError(err).join());
      });

  return (
    <div className={styles.container}>
      <Navbar balance={liveCredits} />
      <div className={styles.content}>
        {/* Title */}
        <Typography
          variant="h1/bold"
          component="h1"
          className={styles.title}
          // todo: remove this
          onClick={() => {
            const newCart: CookieCartItem[] = [
              {
                itemUUID: '17774f20-e04d-4ace-a6fc-8dfe9286eca7',
                optionUUID: 'd75f35b3-e452-46ea-a58b-2a2e010e6ff9',
                quantity: 2,
              },
              {
                itemUUID: 'afe7cfff-9a62-4146-8c8c-5b14f39ba0a0',
                optionUUID: '72d22f34-c366-4ecd-a365-059661a0f0fc',
                quantity: 1,
              },
            ];
            setClientCookie('CART', JSON.stringify(newCart));
            showToast('Filled your cart, buddy-o');
          }}
        >
          {cartState !== CartState.CONFIRMED ? 'Your Cart' : 'Order Confirmation'}
        </Typography>

        {/* Place Order Button */}
        {cart.length > 0 && cartState !== CartState.CONFIRMED ? (
          <StoreModal
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
                disabled={orderTotal > credits}
              >
                <Typography variant="h4/bold" component="span">
                  Place Order
                </Typography>
              </button>
            }
            onConfirm={placeOrder}
            onCancel={() => setCartState(CartState.PRECHECKOUT)}
          >
            {tempFakeEvents[pickupIndex] && (
              <EventCard event={tempFakeEvents[pickupIndex] as PublicEvent} attended={false} />
            )}
          </StoreModal>
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
        {((cart.length > 0 && credits >= orderTotal) || cartState === CartState.CONFIRMED) && (
          <div className={`${styles.cartCard} ${styles.eventPicker}`}>
            <div className={styles.header}>
              <Typography variant="h4/bold" component="h2">
                {cartState !== CartState.CONFIRMED ? 'Choose Pickup Event' : 'Pickup Event Details'}
              </Typography>
            </div>
            <PickupEventPicker
              events={tempFakeEvents}
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

        {credits < orderTotal && (
          <Typography variant="h5/regular" component="p" className={styles.warning}>
            You do not have enough membership points to checkout. Earn more membership points by
            attending ACM events!
          </Typography>
        )}
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
    const cartCookie = getServerCookie('CART', { req, res });
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
  const pickupEventsPromise = getFutureOrderPickupEvents(AUTH_TOKEN);
  const tempFakeEventsPromise = getAllFutureEvents();
  const userPromise = getCurrentUser(AUTH_TOKEN);

  // gather the API request promises and await them concurrently
  const [savedCart, pickupEvents, user, tempFakeEvents] = await Promise.all([
    savedCartPromises,
    pickupEventsPromise,
    userPromise,
    tempFakeEventsPromise,
  ]);

  // update the cart cookie if part of it was malformed
  setServerCookie('CART', clientCartToCookie(savedCart), { req, res });

  return {
    props: {
      user,
      savedCart,
      pickupEvents,
      tempFakeEvents,
      token: AUTH_TOKEN,
    },
  };
};

export const getServerSideProps = withAccessType(getServerSidePropsFunc, loggedInUser);
