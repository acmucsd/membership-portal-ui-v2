export type Styles = {
  blue: string;
  card: string;
  container: string;
  focused: string;
  gray: string;
  green: string;
  label: string;
  orderInfo: string;
  orderStatus: string;
  orderSummary: string;
  red: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
