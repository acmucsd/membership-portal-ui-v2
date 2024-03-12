export type Styles = {
  banner: string;
  communityColor: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
