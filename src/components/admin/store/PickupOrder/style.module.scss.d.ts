export type Styles = {
  fulfilled: string;
  itemList: string;
  notFulfilled: string;
  row: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
