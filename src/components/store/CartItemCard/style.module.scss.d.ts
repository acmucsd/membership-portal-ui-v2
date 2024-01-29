export type Styles = {
  cartItem: string;
  cartItemInfo: string;
  imageWrapper: string;
  leftCol: string;
  price: string;
  removeBtn: string;
  rightCol: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
