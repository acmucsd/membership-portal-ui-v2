export type Styles = {
  close: string;
  container: string;
  contents: string;
  dropdown: string;
  header: string;
  heading: string;
  reschedule: string;
  rescheduleButtons: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
