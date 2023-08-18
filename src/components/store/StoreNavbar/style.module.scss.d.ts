export type Styles = {
  back: string;
  navbar: string;
  navlink: string;
  rightSide: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
