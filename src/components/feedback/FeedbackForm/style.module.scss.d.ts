export type Styles = {
  field: string;
  form: string;
  submit: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
