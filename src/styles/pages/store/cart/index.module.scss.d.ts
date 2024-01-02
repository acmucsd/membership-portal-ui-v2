export type Styles = {
  cartHeader: string;
  cartItem: string;
  cartItemInfo: string;
  cartItemPrice: string;
  cartSection: string;
  checkoutButton: string;
  checkoutModal: string;
  checkoutOptions: string;
  confirming: string;
  container: string;
  content: string;
  emptyCart: string;
  eventNavigation: string;
  pickupSection: string;
  pointsSection: string;
  removeBtn: string;
  sidebar: string;
  temp: string;
  temp2: string;
  warning: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
