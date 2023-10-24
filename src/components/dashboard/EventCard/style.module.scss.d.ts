export type Styles = {
  card: string;
  cover: string;
  details: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
