import { StoreAPI } from '@/lib/api';
import { getClientCookie } from '@/lib/services/CookieService';
import type { UUID } from '@/lib/types';
import type { ClientCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';

//* disabling this until more functions are added
/* eslint-disable import/prefer-default-export */

/**
 * Place a new merch order
 * @param items array of ClientCartItem to order
 * @param pickupEvent uuid of a pickup event
 * @returns successfully created order
 */
export const placeMerchOrder = async (items: ClientCartItem[], pickupEvent: UUID) => {
  const token = getClientCookie(CookieType.ACCESS_TOKEN);
  if (!token) throw new Error('Missing access token');

  return StoreAPI.placeMerchOrder(token, {
    order: items.map(({ option: { uuid }, quantity }) => ({
      option: uuid,
      quantity,
    })),
    pickupEvent,
  });
};

export const rescheduleOrderPickup = async (order: UUID, pickupEvent: UUID) => {
  const token = getClientCookie(CookieType.ACCESS_TOKEN);
  if (!token) throw new Error('Missing access token');

  return StoreAPI.rescheduleOrderPickup(token, order, pickupEvent);
};

export const cancelMerchOrder = async (order: UUID) => {
  const token = getClientCookie(CookieType.ACCESS_TOKEN);
  if (!token) throw new Error('Missing access token');

  return StoreAPI.cancelMerchOrder(token, order);
};
