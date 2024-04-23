export type Styles = {
  cost: string;
  details: string;
  first: string;
  icons: string;
  imageWrapper: string;
  itemCard: string;
  linkWrapper: string;
  outOfStock: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
