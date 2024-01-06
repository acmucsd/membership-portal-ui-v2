export type Styles = {
  shownDesktop: string;
  shownMobile: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
