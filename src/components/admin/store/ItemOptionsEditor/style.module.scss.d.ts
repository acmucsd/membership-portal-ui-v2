export type Styles = {
  grip: string;
  multipleOptions: string;
  options: string;
  tableScroller: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
