export type Styles = {
  card: string;
  cardContainer: string;
  cardHeader: string;
  cardSubHeader: string;
  contents: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
