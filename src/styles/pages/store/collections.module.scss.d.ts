export type Styles = {
  card: string;
  collections: string;
  container: string;
  header: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
