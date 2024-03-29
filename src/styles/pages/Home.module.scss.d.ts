export type Styles = {
  checkin: string;
  checkinButtons: string;
  checkinInput: string;
  content: string;
  desktopOnly: string;
  header: string;
  heading: string;
  hero: string;
  image: string;
  page: string;
  subheading: string;
  submit: string;
  userProgress: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
