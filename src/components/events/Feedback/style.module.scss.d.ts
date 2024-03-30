export type Styles = {
  adminView: string;
  body: string;
  date: string;
  feedback: string;
  status: string;
  statuses: string;
  user: string;
  userView: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
