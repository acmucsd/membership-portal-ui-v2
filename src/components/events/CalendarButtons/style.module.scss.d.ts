export type Styles = {
  appleCalLogo: string;
  calendarButton: string;
  calendarLink: string;
  calendarText: string;
  options: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
