export type Styles = {
  aboutpage: string;
  body: string;
  description: string;
  discordpreview: string;
  logo: string;
  socials: string;
  theme: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
