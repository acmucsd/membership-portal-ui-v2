export type Styles = {
  contents: string;
  eventDetails: string;
  eventInfo: string;
  eventTitle: string;
  header: string;
  image: string;
  link: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
