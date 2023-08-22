export type Styles = {
  cardLeft: string;
  cardRight: string;
  cardText: string;
  leaderboardCard: string;
  match: string;
  profileImage: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
