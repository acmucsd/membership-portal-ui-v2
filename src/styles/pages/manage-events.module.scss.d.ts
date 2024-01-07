export type Styles = {
  buttons: string;
  container: string;
  eventContainer: string;
  header: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
