export type Styles = {
  circle: string;
  cropWrapper: string;
  frame: string;
  image: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
