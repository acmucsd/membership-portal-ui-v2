export type Styles = {
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
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
