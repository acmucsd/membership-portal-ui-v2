export type Styles = {
  cost: string;
  details: string;
  diamond: string;
  itemCard: string;
  outOfStock: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
