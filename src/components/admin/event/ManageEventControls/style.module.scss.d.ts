export type Styles = {
  eventControls: string;
  theme: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
