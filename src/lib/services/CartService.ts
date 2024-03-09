import { getItem } from '@/lib/api/StoreAPI';
import {
  getClientCookie,
  getServerCookie,
  setClientCookie,
  setServerCookie,
} from '@/lib/services/CookieService';
import { PublicMerchItemOption, PublicMerchItemWithPurchaseLimits } from '@/lib/types/apiResponses';
import { ClientCartItem, CookieCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import { OptionsType } from 'cookies-next/lib/types';

// Converters / general cart methods.

const clientCartToCookie = (items: ClientCartItem[]): string =>
  JSON.stringify(
    items.map(item => ({
      itemUUID: item.uuid,
      optionUUID: item.option.uuid,
      quantity: item.quantity,
    }))
  );

/**
 * Given a public merch item, convert it to a cart-friendly item.
 * @param item The public merch item
 * @param optionUUID The UUID of the selected option for the item
 * @param quantity The quantity of the item to add to the cart.
 * @returns A cart-friendly object.
 */
const merchItemToClientCartItem = (
  item: PublicMerchItemWithPurchaseLimits,
  optionUUID: string,
  quantity: number
): ClientCartItem => {
  const { options, ...publicItem } = item;
  // form the ClientCartItem from the PublicMerchItem
  const clientCartItem: Partial<ClientCartItem> = { ...publicItem, quantity };
  clientCartItem.option = options.find(
    (option: PublicMerchItemOption) => option.uuid === optionUUID
  );

  // check for invalid cart cookie item
  if (!clientCartItem.option || typeof quantity !== 'number') throw new Error();
  return clientCartItem as ClientCartItem;
};

export const calculateOrderTotal = (cart: ClientCartItem[]): number => {
  return cart.reduce((total, { quantity, option: { price } }) => total + quantity * price, 0);
};

/**
 * Check if a ClientCartItem is in stock and within lifetime/monthly limits
 * @param item item to validate
 * @returns an error message string if the item is unavailable, or null otherwise
 */
export const validateClientCartItem = (item: ClientCartItem): string | null => {
  if (item.quantity > item.lifetimeRemaining)
    return item.lifetimeRemaining === 0
      ? 'You have already reached your lifetime limit for this item'
      : `You can only purchase ${item.lifetimeRemaining} more of this item`;
  if (item.quantity > item.monthlyRemaining)
    return item.monthlyRemaining === 0
      ? 'You have already reached your monthly limit for this item'
      : `You can only purchase ${item.monthlyRemaining} more of this item this month`;
  if (item.hidden) return 'Ordering this item has been temporarily disabled';
  if (item.option.quantity === 0) return 'This item is out of stock';
  if (item.quantity > item.option.quantity)
    return `You have selected more of this item than is in stock (${item.option.quantity} left)`;
  return null;
};

/**
 * Checks if a ClientCart contains any invalid items (not in stock, not purchaseable, etc.)
 * @param cart cart to validate
 * @returns if the cart is valid to checkout or not.
 */
export const validateClientCart = (cart: ClientCartItem[]): boolean => {
  return !cart.some(item => validateClientCartItem(item) !== null);
};

// Cart CRUD operations.

/**
 * Given a ClientCart, save it as a cookie. This is done client-side.
 */
const saveClientCart = (cart: ClientCartItem[]): void => {
  setClientCookie(CookieType.CART, clientCartToCookie(cart));
};

/**
 * Given a CookieCart, save it as a cookie. This is done client-side.
 */
const saveCookieCart = (cart: CookieCartItem[]): void => {
  setClientCookie(CookieType.CART, JSON.stringify(cart));
};

export const clearCart = (): void => {
  saveCookieCart([]);
};

const getClientCartCookie = (): CookieCartItem[] => {
  try {
    const cartCookie = getClientCookie(CookieType.CART);
    const cart = JSON.parse(cartCookie);
    if (!Array.isArray(cart)) throw new Error();
    return cart;
  } catch {
    return [];
  }
};

const getServerCartCookie = (options: OptionsType): CookieCartItem[] => {
  try {
    const cartCookie = getServerCookie(CookieType.CART, options);
    const cart = JSON.parse(cartCookie);
    if (!Array.isArray(cart)) throw new Error();
    return cart;
  } catch {
    return [];
  }
};

/**
 * Fetch the cart from local storage and load in up-to-date information on each item
 * from the portal API. Intended to be run inside getServerSideProps.
 * @param options Server side options.
 * @returns The parsed and up-to-date cart.
 */
export const getCart = async (options: OptionsType): Promise<ClientCartItem[]> => {
  // Get the auth token for API calls.
  const AUTH_TOKEN = getServerCookie(CookieType.ACCESS_TOKEN, options);

  // recover saved items and reset the cart to [] if the cookie is malformed.
  const savedItems = getServerCartCookie(options);

  const savedCart = await Promise.all(
    savedItems.map(async ({ itemUUID, optionUUID, quantity }: CookieCartItem) => {
      try {
        const item = await getItem(AUTH_TOKEN, itemUUID);
        return merchItemToClientCartItem(item, optionUUID, quantity);
      } catch {
        return undefined;
      }
    })
  ).then((items): ClientCartItem[] => items.filter(item => item !== undefined) as ClientCartItem[]);

  // update the cart cookie if part of it was malformed
  setServerCookie(CookieType.CART, clientCartToCookie(savedCart), options);

  return savedCart;
};

/**
 * Given a ClientCart, remove the requested item from the cart.
 * @param cart The cart to modify.
 * @param item The item to remove from the cart, if it exists.
 * @returns The modified cart.
 */
export const removeItem = (cart: ClientCartItem[], item: ClientCartItem): ClientCartItem[] => {
  const optionUUID = item.option.uuid;
  const newCart = cart.filter(item => item.option.uuid !== optionUUID);
  saveClientCart(newCart);
  return newCart;
};

/**
 * Add the requested item and its quantity to the cart.
 * This is performed client side, so cookies are used.
 * @param cart The cart to modify.
 * @param item The item to add to the cart.
 * @returns The modified cart.
 */
export const addItem = (
  item: PublicMerchItemWithPurchaseLimits,
  option: PublicMerchItemOption,
  quantity: number
): void => {
  const cart = getClientCartCookie();
  if (cart.some(item => item.optionUUID === option.uuid)) {
    // If the item exists in the cart, find it and increment its value.
    const newCart = cart.map(item => {
      return {
        ...item,
        quantity: item.optionUUID === option.uuid ? item.quantity + quantity : item.quantity,
      };
    });
    saveCookieCart(newCart);
  } else {
    // Otherwise, append it to the cart.
    const newCart = [...cart, { itemUUID: item.uuid, optionUUID: option.uuid, quantity }];
    saveCookieCart(newCart);
  }
};
