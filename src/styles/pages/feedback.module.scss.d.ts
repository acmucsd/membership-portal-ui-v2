export type Styles = {
  controls: string;
  filterOption: string;
  link: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
