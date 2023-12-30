export type Styles = {
  circle: string;
  controls: string;
  cropWrapper: string;
  frame: string;
  image: string;
  upload: string;
  zoom: string;
  zoomWrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
