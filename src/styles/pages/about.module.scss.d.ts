export type Styles = {
  body: string;
  container: string;
  description: string;
  discordPreview: string;
  header: string;
  icon: string;
  logo: string;
  socials: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
