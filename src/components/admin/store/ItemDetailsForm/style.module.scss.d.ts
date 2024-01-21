export type Styles = {
  addImage: string;
  form: string;
  header: string;
  options: string;
  photos: string;
  submitButtons: string;
  viewPage: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
