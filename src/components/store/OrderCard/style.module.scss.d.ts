export type Styles = {
  card: string;
  container: string;
  desktop: string;
  focused: string;
  label: string;
  mobile: string;
  mobileHeader: string;
  orderInfo: string;
  orderSummary: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
