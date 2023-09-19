export type Styles = {
  closed: string;
  contents: string;
  dropdownWrapper: string;
  option: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
