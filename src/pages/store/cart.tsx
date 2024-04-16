import { Typography } from '@/components/common';
import {
  CartItemCard,
  Diamonds,
  Navbar,
  PickupEventDetail,
  PickupEventPicker,
  StoreConfirmModal,
} from '@/components/store';
import { config, showToast } from '@/lib';
import { getFutureOrderPickupEvents } from '@/lib/api/StoreAPI';
import { getCurrentUserAndRefreshCookie } from '@/lib/api/UserAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import { StoreManager } from '@/lib/managers';
import { CartService } from '@/lib/services';
import { getServerCookie } from '@/lib/services/CookieService';
import { loggedInUser } from '@/lib/services/PermissionService';
import {
  PrivateProfile,
  PublicOrderPickupEvent,
  PublicOrderPickupEventWithLinkedEvent,
} from '@/lib/types/apiResponses';
import { ClientCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
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

const StoreCartPage = ({ user: { credits }, savedCart, pickupEvents }: CartPageProps) => {
  const [cart, setCart] = useState(savedCart);
  const [pickupIndex, setPickupIndex] = useState(0);
  const [cartState, setCartState] = useState(CartState.PRECHECKOUT);
  const [orderTotal, setOrderTotal] = useState(CartService.calculateOrderTotal(savedCart));
  const [liveCredits, setLiveCredits] = useState(credits);

  // update the cart cookie and order total
  useEffect(() => {
    setOrderTotal(CartService.calculateOrderTotal(cart));
  }, [cart, credits]);

  const cartInvalid = useMemo(() => !CartService.validateClientCart(cart), [cart]);

  // prop for item cards to remove their item
  const removeItem = (item: ClientCartItem) => {
    setCart(cart => CartService.removeItem(cart, item));
  };

  // handle confirming an order
  const placeOrder = () =>
    StoreManager.placeMerchOrder(cart, pickupEvents[pickupIndex]?.uuid ?? 'x')
      .then(({ items, pickupEvent }) => {
        showToast(
          `Order with ${items.length} item${items.length === 1 ? '' : 's'} placed`,
          `Pick up at ${pickupEvent.title}`
        );
        setCartState(CartState.CONFIRMED);
        CartService.clearCart();
        setLiveCredits(credits - orderTotal);
      })
      .catch(err => {
        reportError('Unable to place order', err);
      });

  return (
    <div className={styles.container}>
      <Navbar balance={liveCredits} showBack />
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
              <div className={styles.pickupEventDetail}>
                <PickupEventDetail
                  pickupEvent={pickupEvents[pickupIndex] as PublicOrderPickupEvent}
                />
              </div>
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
              Please pick up your items at the event you selected. Thank you!
            </Typography>
            <div>
              <Link href={config.store.homeRoute}>
                <button type="button" className={styles.storeButton}>
                  <Typography variant="h5/bold" component="span">
                    Continue Shopping
                  </Typography>
                </button>
              </Link>
              <Link href={config.store.myOrdersRoute}>
                <Typography variant="h5/bold" className={styles.storeButton}>
                  My Orders
                </Typography>
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
              removeItem={() => removeItem(item)}
              removable={cartState !== CartState.CONFIRMED}
            />
          ))}
          {cart.length === 0 && (
            <div className={styles.emptyCart}>
              <EmptyCartIcon />
              <Typography variant="h6/regular" component="p">
                Your cart is empty. Visit the ACM Store to add items!
              </Typography>
              <Link href={config.store.homeRoute}>
                <Typography variant="h5/medium" className={styles.storeButton}>
                  Go to Store
                </Typography>
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

  const savedCartPromise = CartService.getCart({ req, res });
  const pickupEventsPromise = getFutureOrderPickupEvents(AUTH_TOKEN).then(events =>
    events
      .filter(event => event.status !== 'CANCELLED')
      .filter(
        event => (event.orders?.length ?? 0) <= (event?.orderLimit ?? Number.MAX_SAFE_INTEGER)
      )
  );
  const userPromise = getCurrentUserAndRefreshCookie(AUTH_TOKEN, { req, res });

  // gather the API request promises and await them concurrently
  const [savedCart, pickupEvents, user] = await Promise.all([
    savedCartPromise,
    pickupEventsPromise,
    userPromise,
  ]);

  return {
    props: {
      title: 'Cart',
      user,
      savedCart,
      pickupEvents,
    },
  };
};

export const getServerSideProps = withAccessType(getServerSidePropsFunc, loggedInUser);
