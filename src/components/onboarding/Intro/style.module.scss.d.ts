export type Styles = {
  anchor: string;
  appear: string;
  desktopOnly: string;
  image: string;
  imageWrapper: string;
  mobileOnly: string;
  pill: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
