export interface CookieCartItem {
  itemUUID: string;
  optionUUID: string;
  quantity: number;
}

/**
 * Similar to PublicCartItem but holds exactly one option
 */
export interface ClientCartItem extends Omit<PublicMerchItem, 'options'> {
  option: PublicMerchItemOption;
  quantity: number;
}
