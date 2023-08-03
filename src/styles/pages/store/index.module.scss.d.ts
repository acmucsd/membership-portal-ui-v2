export type Styles = {
  container: string;
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
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
