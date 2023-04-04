export type Styles = {
  content: string;
  header: string;
  headerTitle: string;
  navLeft: string;
  wainbow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
