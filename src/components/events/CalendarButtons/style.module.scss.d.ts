export type Styles = {
  appleCalLogo: string;
  calendarButton: string;
  calendarLink: string;
  options: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
