export type Styles = {
  card: string;
  description: string;
  title: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
