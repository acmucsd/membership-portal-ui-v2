export type Styles = {
  cardLeft: string;
  cardRight: string;
  cardText: string;
  first: string;
  leaderboardCard: string;
  profileImage: string;
  second: string;
  third: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
