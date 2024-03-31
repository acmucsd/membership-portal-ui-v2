export type Styles = {
  ai: string;
  banner: string;
  cyber: string;
  design: string;
  fadeIn: string;
  general: string;
  hack: string;
  path: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
