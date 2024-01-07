export type Styles = {
  bar: string;
  bars: string;
  barsRight: string;
  clip: string;
  contentWidth: string;
  orange: string;
  pink: string;
  rainbow: string;
  red: string;
  rotate: string;
  strokeIn: string;
  teal: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
