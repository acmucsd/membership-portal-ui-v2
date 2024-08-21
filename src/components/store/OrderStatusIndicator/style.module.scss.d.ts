export type Styles = {
  blue: string;
  gray: string;
  green: string;
  orderStatus: string;
  red: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
