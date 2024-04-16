export type Styles = {
  details: string;
  eventInfo: string;
  image: string;
  pickupEvent: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
