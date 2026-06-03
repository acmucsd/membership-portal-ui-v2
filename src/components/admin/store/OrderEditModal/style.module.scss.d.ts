export type Styles = {
  actionButtons: string;
  actionColumn: string;
  buttonContainer: string;
  container: string;
  header: string;
  table: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
