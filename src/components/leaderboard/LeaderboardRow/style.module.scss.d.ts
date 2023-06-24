export type Styles = {
  name: string;
  nameRank: string;
  points: string;
  position: string;
  profilePicture: string;
  rank: string;
  row: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
