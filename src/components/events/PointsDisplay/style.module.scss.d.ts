export type Styles = {
  blue: string;
  circle: string;
  green: string;
  inner: string;
  points: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
