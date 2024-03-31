export type Styles = {
  defaultThemeColorHex: string;
  expandButton: string;
  form: string;
  header: string;
  submitButtons: string;
  viewPage: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
