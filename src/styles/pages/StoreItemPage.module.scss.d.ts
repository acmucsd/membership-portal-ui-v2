export type Styles = {
  cover: string;
  coverContainer: string;
  navbarBodyDiv: string;
  optionsContainer: string;
  rowContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
