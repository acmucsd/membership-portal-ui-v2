export type Styles = {
  contents: string;
  header: string;
  image: string;
  link: string;
  modal: string;
  modalBody: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
