export type Styles = {
  aside: string;
  line: string;
  login: string;
  signUp: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
