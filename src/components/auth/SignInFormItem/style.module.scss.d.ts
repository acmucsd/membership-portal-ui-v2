export type Styles = {
  formError: string;
  formInput: string;
  formItem: string;
  iconContainer: string;
  inputField: string;
  selectField: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
