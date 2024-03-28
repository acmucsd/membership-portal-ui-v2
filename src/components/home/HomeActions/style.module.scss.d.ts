export type Styles = {
  actions: string;
  checkin: string;
  checkinButtons: string;
  checkinInput: string;
  subheading: string;
  submit: string;
  userProgress: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
