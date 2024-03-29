export type Styles = {
  appear: string;
  checkin: string;
  checkinButtons: string;
  checkinInput: string;
  content: string;
  heading: string;
  hero: string;
  image: string;
  page: string;
  raccoon: string;
  recentlyAttended: string;
  subheading: string;
  submit: string;
  upcomingEvents: string;
  userProgress: string;
  wave: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
