export type Styles = {
  close: string;
  container: string;
  contents: string;
  details: string;
  dropdown: string;
  eventInfo: string;
  header: string;
  heading: string;
  image: string;
  pickupEvent: string;
  reschedule: string;
  rescheduleButtons: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
