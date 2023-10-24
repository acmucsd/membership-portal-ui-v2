export type Styles = {
  cards: string;
  checkIn: string;
  content: string;
  hero: string;
  heroContent: string;
  links: string;
  row: string;
  welcome: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
