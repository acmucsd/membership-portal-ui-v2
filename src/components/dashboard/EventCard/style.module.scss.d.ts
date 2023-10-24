export type Styles = {
  appear: string;
  attended: string;
  bottom: string;
  card: string;
  cover: string;
  details: string;
  points: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
