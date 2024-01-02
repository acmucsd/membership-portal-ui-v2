export type Styles = {
  actions: string;
  checkin: string;
  checkinButtons: string;
  checkinInput: string;
  content: string;
  desktop: string;
  header: string;
  headline: string;
  hero: string;
  image: string;
  inline: string;
  link: string;
  mobile: string;
  submit: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
