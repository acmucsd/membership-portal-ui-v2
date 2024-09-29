export type Styles = {
  annotation: string;
  annotationAppear: string;
  annotationHighlight: string;
  annotationWrapper: string;
  desktopOnly: string;
  fadeOut: string;
  items: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
