export type Styles = {
  container: string;
  rowContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
