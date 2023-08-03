export type Styles = {
  barsLeft: string;
  barsRight: string;
  deco1: string;
  deco2: string;
  description: string;
  heading: string;
  hero: string;
  heroContent: string;
  imageWrapper: string;
  left: string;
  orange: string;
  pink: string;
  rainbow: string;
  rainbowWrapper: string;
  red: string;
  right: string;
  teal: string;
  textButton: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
