export type Styles = {
  ai: string;
  button: string;
  buttonRow: string;
  container: string;
  cyber: string;
  design: string;
  done: string;
  general: string;
  graphic: string;
  hack: string;
  header: string;
  headerText: string;
  innovate: string;
  subheader: string;
  subheaderText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
