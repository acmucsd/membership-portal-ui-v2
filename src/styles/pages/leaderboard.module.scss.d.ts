export type Styles = {
  container: string;
  header: string;
  leaderboard: string;
  row: string;
  topThreeContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
