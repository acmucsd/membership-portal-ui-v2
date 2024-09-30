export type Styles = {
  community: string;
  description: string;
  fadeIn: string;
  logo: string;
  name: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
