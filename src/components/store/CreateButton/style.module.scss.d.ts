export type Styles = {
  horizontal: string;
  icon: string;
  itemCard: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
