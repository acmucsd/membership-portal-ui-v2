export type Styles = {
  annotation: string;
  annotationAppear: string;
  annotationContent: string;
  annotationHighlight: string;
  annotationLine: string;
  annotationLineAppear: string;
  annotationWrapper: string;
  desktopOnly: string;
  fadeOut: string;
  hideOnMobile: string;
  items: string;
  page: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
