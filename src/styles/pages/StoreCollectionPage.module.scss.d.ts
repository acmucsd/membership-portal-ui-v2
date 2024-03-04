export type Styles = {
  browseItems: string;
  collections: string;
  container: string;
  header: string;
  photo: string;
  photos: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
