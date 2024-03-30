export type Styles = {
  acknowledge: string;
  acknowledged: string;
  body: string;
  button: string;
  date: string;
  feedback: string;
  ignore: string;
  ignored: string;
  response: string;
  status: string;
  user: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
