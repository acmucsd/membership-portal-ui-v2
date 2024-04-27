export type Styles = {
  button1: string;
  button2: string;
  link: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
