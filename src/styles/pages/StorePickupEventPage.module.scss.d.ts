export type Styles = {
  active: string;
  cardContainer: string;
  displayButton: string;
  displayButtons: string;
  header: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
