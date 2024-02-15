import { StoreAPI } from '@/lib/api';
import { getClientCookie } from '@/lib/services/CookieService';
import type { UUID } from '@/lib/types';
import type { PublicOrderWithItems } from '@/lib/types/apiResponses';
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
export const placeMerchOrder = (items: ClientCartItem[], pickupEvent: UUID) =>
  new Promise<PublicOrderWithItems>((resolve, reject) => {
    const token = getClientCookie(CookieType.ACCESS_TOKEN);
    if (!token) reject(new Error('Missing access token'));

    StoreAPI.placeMerchOrder(token, {
      order: items.map(({ option: { uuid }, quantity }) => ({
        option: uuid,
        quantity,
      })),
      pickupEvent,
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response.data.error));
  });
