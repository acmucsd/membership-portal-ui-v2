export type Styles = {
  cost: string;
  details: string;
  icons: string;
  imageWrapper: string;
  itemCard: string;
  linkWrapper: string;
  outOfStock: string;
  second: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
