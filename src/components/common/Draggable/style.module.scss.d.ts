export type Styles = {
  dragging: string;
  dragHandle: string;
  dragItem: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
