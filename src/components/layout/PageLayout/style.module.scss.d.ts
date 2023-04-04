export type Styles = {
  oneColumn: string;
  twoColumn: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
