export type Styles = {
  body: string;
  card: string;
  header: string;
  options: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
