export type Styles = {
  content: string;
  desktopOnly: string;
  header: string;
  heading: string;
  hero: string;
  image: string;
  subheading: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
