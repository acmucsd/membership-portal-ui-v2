export type Styles = {
  arrow: string;
  closed: string;
  contents: string;
  dropdownWrapper: string;
  option: string;
  readOnly: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
