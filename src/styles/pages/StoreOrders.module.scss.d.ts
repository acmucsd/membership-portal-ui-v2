export type Styles = {
  container: string;
  filter: string;
  header: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
