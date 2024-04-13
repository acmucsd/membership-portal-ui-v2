export type Styles = {
  acknowledge: string;
  acknowledged: string;
  body: string;
  button: string;
  date: string;
  event: string;
  feedback: string;
  hasUser: string;
  header: string;
  ignore: string;
  ignored: string;
  noHeader: string;
  response: string;
  status: string;
  user: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
