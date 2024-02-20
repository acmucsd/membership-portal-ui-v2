export type Styles = {
  error: string;
  itemHeaderGroup: string;
  itemName: string;
  price: string;
  valid: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
