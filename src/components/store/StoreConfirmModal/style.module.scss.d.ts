export type Styles = {
  body: string;
  cancel: string;
  card: string;
  confirm: string;
  confirmRemove: string;
  header: string;
  options: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
