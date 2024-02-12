export type Styles = {
  bottomSheet: string;
  close: string;
  hasHeader: string;
  header: string;
  modal: string;
  modalBody: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
