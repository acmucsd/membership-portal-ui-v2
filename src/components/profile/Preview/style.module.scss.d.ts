export type Styles = {
  bio: string;
  faded: string;
  major: string;
  pfp: string;
  stat: string;
  stats: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
