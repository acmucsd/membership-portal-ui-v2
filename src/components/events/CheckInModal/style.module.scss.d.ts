export type Styles = {
  close: string;
  container: string;
  done: string;
  graphic: string;
  header: string;
  headerText: string;
  image: string;
  subheader: string;
  subheaderText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
