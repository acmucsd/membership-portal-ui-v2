export type Styles = {
  image: string;
  info: string;
  name: string;
  resume: string;
  user: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
