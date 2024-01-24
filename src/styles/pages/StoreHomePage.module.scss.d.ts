export type Styles = {
  collections: string;
  container: string;
  header: string;
  viewToggle: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
