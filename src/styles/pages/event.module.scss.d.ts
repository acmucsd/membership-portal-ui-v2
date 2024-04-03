export type Styles = {
  page: string;
  submittedFeedback: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
