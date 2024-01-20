export type Styles = {
  checkbox: string;
  label: string;
  switch: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
