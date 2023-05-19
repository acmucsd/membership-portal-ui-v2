export type Styles = {
  autofillRow: string;
  back: string;
  container: string;
  form: string;
  optionsContainer: string;
  submitButtons: string;
  titleRow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
