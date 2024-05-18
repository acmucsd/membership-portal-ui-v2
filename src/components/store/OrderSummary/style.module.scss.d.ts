export type Styles = {
  buttons: string;
  container: string;
  divider: string;
  footer: string;
  image: string;
  itemInfo: string;
  itemSummary: string;
  label: string;
  partiallyFulfilledText: string;
  totalDiamonds: string;
  totalPrice: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
