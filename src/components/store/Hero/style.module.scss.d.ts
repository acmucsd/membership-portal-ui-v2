export type Styles = {
  deco1: string;
  deco2: string;
  description: string;
  heading: string;
  hero: string;
  heroContent: string;
  imageWrapper: string;
  left: string;
  pop: string;
  popIn: string;
  rainbowIn: string;
  right: string;
  shadowIn: string;
  spinIn: string;
  textButton: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
