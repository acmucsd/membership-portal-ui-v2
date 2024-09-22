export type Styles = {
  buttonRow: string;
  caption: string;
  clockIcon: string;
  content: string;
  header: string;
  progress: string;
  progressBar: string;
  showProgress: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
