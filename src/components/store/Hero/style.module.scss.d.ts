export type Styles = {
  deco1: string;
  deco2: string;
  description: string;
  heading: string;
  hero: string;
  heroContent: string;
  imageWrapper: string;
  left: string;
  right: string;
  textButton: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
