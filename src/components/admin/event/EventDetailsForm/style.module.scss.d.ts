export type Styles = {
  back: string;
  container: string;
  eventCover: string;
  form: string;
  submitButtons: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
