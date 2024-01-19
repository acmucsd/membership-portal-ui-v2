export type Styles = {
  diamond: string;
  discount: string;
  discountPrice: string;
  originalPrice: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
