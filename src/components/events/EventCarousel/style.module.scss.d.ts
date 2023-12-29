export type Styles = {
  card: string;
  header: string;
  headerText: string;
  viewToggle: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
