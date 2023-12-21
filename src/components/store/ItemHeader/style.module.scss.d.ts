export type Styles = {
  button: string;
  buttonInStock: string;
  buttonNoStock: string;
  error: string;
  itemHeaderGroup: string;
  price: string;
  valid: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
