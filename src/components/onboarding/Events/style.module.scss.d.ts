export type Styles = {
  annotation: string;
  annotationAppear: string;
  badgeHighlight: string;
  badgeWrapper: string;
  desktopOnly: string;
  events: string;
  fadeOut: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
