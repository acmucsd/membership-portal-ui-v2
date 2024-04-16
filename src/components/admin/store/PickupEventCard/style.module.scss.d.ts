export type Styles = {
  active: string;
  cancelled: string;
  card: string;
  completed: string;
  displayButton: string;
  header: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
