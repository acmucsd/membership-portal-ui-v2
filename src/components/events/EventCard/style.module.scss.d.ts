export type Styles = {
  bordered: string;
  container: string;
  image: string;
  info: string;
  infoText: string;
  interactive: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
