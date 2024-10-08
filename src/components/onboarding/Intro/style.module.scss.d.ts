export type Styles = {
  appear: string;
  desktopOnly: string;
  image: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
