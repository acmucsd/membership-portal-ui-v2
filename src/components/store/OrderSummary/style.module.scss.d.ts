export type Styles = {
  badge: string;
  buttons: string;
  container: string;
  divider: string;
  footer: string;
  image: string;
  itemInfo: string;
  itemSummary: string;
  label: string;
  notAvailable: string;
  partiallyFulfilledText: string;
  pickedUp: string;
  rescheduleReminder: string;
  totalDiamonds: string;
  totalPrice: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
