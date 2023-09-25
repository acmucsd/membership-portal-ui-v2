export type Styles = {
  icon: string | undefined;
  switch: string;
  switchindicator: string;
  switchOne: string;
  switchThree: string;
  switchTwo: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
