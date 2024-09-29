export type Styles = {
  events: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
