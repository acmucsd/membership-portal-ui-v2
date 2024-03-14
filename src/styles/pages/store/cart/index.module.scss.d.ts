export type Styles = {
  cartCard: string;
  confirmation: string;
  confirming: string;
  container: string;
  content: string;
  emptyCart: string;
  eventPicker: string;
  header: string;
  items: string;
  placeOrder: string;
  points: string;
  pointsCard: string;
  storeButton: string;
  title: string;
  warning: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
