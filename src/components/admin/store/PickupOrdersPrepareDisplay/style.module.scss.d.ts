export type Styles = {
  breakdown: string;
  container: string;
  itemList: string;
  table: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
