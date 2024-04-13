export type Styles = {
  pageNumber: string;
  paginationBtn: string;
  paginationBtns: string;
  paginationText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
