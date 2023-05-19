export type Styles = {
  cover: string;
  coverContainer: string;
  event: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
