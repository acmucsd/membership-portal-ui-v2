export type Styles = {
  actions: string;
  checkin: string;
  checkinButtons: string;
  checkinInput: string;
  content: string;
  header: string;
  heading: string;
  hero: string;
  image: string;
  link: string;
  mobile: string;
  subheading: string;
  submit: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
