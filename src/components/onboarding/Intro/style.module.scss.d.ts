export type Styles = {
  anchor: string;
  appear: string;
  image: string;
  pill: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
