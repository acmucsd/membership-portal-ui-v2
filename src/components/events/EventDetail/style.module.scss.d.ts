export type Styles = {
  badges: string;
  close: string;
  closeIcon: string;
  container: string;
  description: string;
  eventDetails: string;
  eventInfo: string;
  eventTitle: string;
  feedbackBtn: string;
  header: string;
  image: string;
  standalone: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
