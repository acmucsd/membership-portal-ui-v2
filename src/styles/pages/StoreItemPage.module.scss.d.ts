export type Styles = {
  coverContainer: string;
  image: string;
  imageContainer: string;
  images: string;
  navbarBodyDiv: string;
  optionsContainer: string;
  rowContainer: string;
  selected: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
