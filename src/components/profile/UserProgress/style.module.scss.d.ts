export type Styles = {
  inner: string;
  levelDescription: string;
  levelProgress: string;
  levelText: string;
  progressBar: string;
  progressInfo: string;
  progressSection: string;
  progressText: string;
  sectionHeader: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
