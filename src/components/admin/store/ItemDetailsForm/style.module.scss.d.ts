export type Styles = {
  addImage: string;
  form: string;
  grip: string;
  header: string;
  multipleOptions: string;
  options: string;
  photos: string;
  submitButtons: string;
  tableScroller: string;
  viewPage: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
