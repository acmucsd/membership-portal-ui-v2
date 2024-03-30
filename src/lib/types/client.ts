import { PublicMerchItemOption, PublicMerchItemWithPurchaseLimits } from '@/lib/types/apiResponses';

export interface CookieCartItem {
  itemUUID: string;
  optionUUID: string;
  quantity: number;
}

/**
 * Similar to PublicCartItem but holds exactly one option
 */
export interface ClientCartItem extends Omit<PublicMerchItemWithPurchaseLimits, 'options'> {
  option: PublicMerchItemOption;
  quantity: number;
}

export type FilterEventOptions = {
  community: 'all' | 'general' | 'ai' | 'cyber' | 'design' | 'hack';
  date: 'all-time' | 'past-year' | 'past-month' | 'past-week' | 'upcoming';
  attended: 'any' | 'attended' | 'not-attended';
};
