export type Styles = {
  checkIn: string;
  hero: string;
  heroContent: string;
  links: string;
  row: string;
  welcome: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
