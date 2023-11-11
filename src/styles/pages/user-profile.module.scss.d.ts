export type Styles = {
  about: string;
  banner: string;
  cardHalf: string;
  cardWrapper: string;
  horizontal: string;
  iconBox: string;
  inner: string;
  profileCard: string;
  profilePage: string;
  profilePic: string;
  progressBar: string;
  progressInfo: string;
  section: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
