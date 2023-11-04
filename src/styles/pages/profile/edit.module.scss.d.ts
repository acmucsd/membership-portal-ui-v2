export type Styles = {
  columnLeft: string;
  columnRight: string;
  columns: string;
  icon: string;
  mainContent: string;
  section: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
