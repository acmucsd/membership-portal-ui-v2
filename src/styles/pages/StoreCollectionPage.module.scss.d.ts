export type Styles = {
  collections: string;
  container: string;
  createItem: string;
  header: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
