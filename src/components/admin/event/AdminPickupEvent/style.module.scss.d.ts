export type Styles = {
  addImage: string;
  defaultThemeColorHex: string;
  form: string;
  header: string;
  photos: string;
  submitButtons: string;
  viewPage: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
