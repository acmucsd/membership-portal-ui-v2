export type Styles = {
  container: string;
  done: string;
  graphic: string;
  header: string;
  headerText: string;
  subheader: string;
  subheaderText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
