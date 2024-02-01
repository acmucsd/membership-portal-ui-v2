export type Styles = {
  bordered: string;
  container: string;
  eventDetails: string;
  header: string;
  image: string;
  info: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
