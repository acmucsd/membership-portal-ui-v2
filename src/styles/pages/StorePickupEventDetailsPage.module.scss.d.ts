export type Styles = {
  active: string;
  back: string;
  container: string;
  displayButton: string;
  displayButtons: string;
  header: string;
  noEvent: string;
  orders: string;
  page: string;
  pickupDetails: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
