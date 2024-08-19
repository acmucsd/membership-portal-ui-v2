export type Styles = {
  dropdown: string;
  eventPicker: string;
  noEvents: string;
  window: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
