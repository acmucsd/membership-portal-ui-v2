export type Styles = {
  container: string;
  header: string;
  heading: string;
  leaderboard: string;
  topThreeContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
