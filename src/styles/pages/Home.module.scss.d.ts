export type Styles = {
  actions: string;
  attended: string;
  hero: string;
  page: string;
  upcoming: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
