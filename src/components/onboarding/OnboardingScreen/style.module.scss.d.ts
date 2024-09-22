export type Styles = {
  buttonRow: string;
  caption: string;
  clockIcon: string;
  content: string;
  fadeIn: string;
  header: string;
  progress: string;
  progressBar: string;
  showProgress: string;
  title: string;
  wrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
