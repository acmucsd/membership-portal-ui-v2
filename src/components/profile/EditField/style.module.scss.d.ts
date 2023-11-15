export type Styles = {
  chars: string;
  content: string;
  description: string;
  disabled: string;
  field: string;
  fieldBorder: string;
  hasIcon: string;
  info: string;
  label: string;
  prefix: string;
  singleField: string;
  singleLabel: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
