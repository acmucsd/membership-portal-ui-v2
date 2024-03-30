export type Styles = {
  field: string;
  form: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
