export type Styles = {
  defaultThemeColorHex: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
