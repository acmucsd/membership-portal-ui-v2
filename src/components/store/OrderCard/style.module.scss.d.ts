export type Styles = {
  blue: string;
  container: string;
  gray: string;
  green: string;
  label: string;
  orderInfo: string;
  orderStatus: string;
  red: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
