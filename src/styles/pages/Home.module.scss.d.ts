export type Styles = {
  appear: string;
  cardAppear: string;
  checkin: string;
  checkinButtons: string;
  checkinInput: string;
  content: string;
  date: string;
  fadeIn: string;
  gradientIn: string;
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
