export type Styles = {
  sizeSelector: string;
  switch: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
