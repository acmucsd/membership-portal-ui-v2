export type Styles = {
  ai: string;
  banner: string;
  cyber: string;
  design: string;
  general: string;
  hack: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
