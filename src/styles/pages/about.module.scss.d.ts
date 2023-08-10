export type Styles = {
  body: string;
  container: string;
  description: string;
  discordpreview: string;
  header: string;
  logo: string;
  socials: string;
  theme: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
