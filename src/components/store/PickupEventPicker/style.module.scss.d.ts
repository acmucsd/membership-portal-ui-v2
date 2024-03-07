export type Styles = {
  eventNavigation: string;
  eventPicker: string;
  noEvents: string;
  slider: string;
  window: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
