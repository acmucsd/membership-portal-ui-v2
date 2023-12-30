export type Styles = {
  container: string;
  divider: string;
  image: string;
  itemInfo: string;
  itemSummary: string;
  label: string;
  totalDiamonds: string;
  totalPrice: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
