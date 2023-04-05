export type Styles = {
  content: string;
  header: string;
  headerTitle: string;
  icon: string;
  iconLinks: string;
  navLeft: string;
  portalLinks: string;
  wainbow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
