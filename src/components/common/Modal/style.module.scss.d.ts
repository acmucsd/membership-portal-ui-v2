export type Styles = {
  close: string;
  header: string;
  modal: string;
  modalBody: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;