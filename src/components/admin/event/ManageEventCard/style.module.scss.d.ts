export type Styles = {
  cardEvent: string;
  cover: string;
  coverContainer: string;
  eventInfo: string;
  eventText: string;
  eventTitle: string;
  rowEvent: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
