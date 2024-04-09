export type Styles = {
  clearSelection: string;
  indicator: string;
  other: string;
  otherField: string;
  response: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
