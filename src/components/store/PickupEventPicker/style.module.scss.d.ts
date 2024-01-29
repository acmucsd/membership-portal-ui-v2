export type Styles = {
  eventNavigation: string;
  eventPicker: string;
  slider: string;
  window: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
