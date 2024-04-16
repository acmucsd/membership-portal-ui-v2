export type Styles = {
  body: string;
  bodyText: string;
  buttons: string;
  close: string;
  container: string;
  header: string;
  heading: string;
  text: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
