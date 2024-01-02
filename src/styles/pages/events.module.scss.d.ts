export type Styles = {
  controls: string;
  filterOption: string;
  page: string;
  search: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
