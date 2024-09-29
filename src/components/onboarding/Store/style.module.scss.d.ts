export type Styles = {
  desktopOnly: string;
  items: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
