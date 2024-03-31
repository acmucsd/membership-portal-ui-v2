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

export type CommunityFilterOptions = 'all' | 'general' | 'ai' | 'cyber' | 'design' | 'hack';

export type DateFilterOptions = 'all-time' | 'past-year' | 'past-month' | 'past-week' | 'upcoming';

export type AttendanceFilterOptions = 'any' | 'attended' | 'not-attended';

export type FilterEventOptions = {
  community: CommunityFilterOptions;
  date: DateFilterOptions;
  attendance: AttendanceFilterOptions;
  search: string;
};

export function isValidCommunityFilter(value: string): value is CommunityFilterOptions {
  return ['all', 'general', 'ai', 'cyber', 'design', 'hack'].some(v => v === value);
}

export function isValidDateFilter(value: string): value is DateFilterOptions {
  return ['all-time', 'past-year', 'past-month', 'past-week', 'upcoming'].some(v => v === value);
}

export function isValidAttendanceFilter(value: string): value is AttendanceFilterOptions {
  return ['any', 'attended', 'not-attended'].some(v => v === value);
}
