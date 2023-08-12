export type Styles = {
  barsLeft: string;
  barsRest: string;
  barsRight: string;
  orange: string;
  pink: string;
  rainbow: string;
  rainbowContent: string;
  rainbowWrapper: string;
  red: string;
  teal: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
