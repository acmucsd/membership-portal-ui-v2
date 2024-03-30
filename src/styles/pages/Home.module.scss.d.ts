export type Styles = {
  desktop: string;
  page: string;
  row: string;
  subheading: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
