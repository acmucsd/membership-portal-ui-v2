export type Styles = {
  icon: string;
  iconDarkMode: string;
  iconLightMode: string;
  indicatorDarkMode: string;
  indicatorLightMode: string;
  switch: string;
  switchDarkMode: string;
  switchindicator: string;
  switchLightMode: string;
  switchOne: string;
  switchThree: string;
  switchTwo: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
