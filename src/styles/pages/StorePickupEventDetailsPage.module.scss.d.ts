export type Styles = {
  active: string;
  back: string;
  buttonContainer: string;
  container: string;
  description: string;
  displayButton: string;
  displayButtons: string;
  noEvent: string;
  orders: string;
  page: string;
  pickupDetails: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
