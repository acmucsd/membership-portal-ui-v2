export type Styles = {
  addCartGroup: string;
  button: string;
  buttonInStock: string;
  buttonNoStock: string;
  buttonRow: string;
  error: string;
  quantityColumn: string;
  valid: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
