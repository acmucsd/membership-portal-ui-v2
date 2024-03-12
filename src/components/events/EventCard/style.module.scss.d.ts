export type Styles = {
  badge: string;
  badgeAi: string;
  badgeAttended: string;
  badgeCyber: string;
  badgeDesign: string;
  badgeGeneral: string;
  badgeHack: string;
  badgePoints: string;
  badges: string;
  bordered: string;
  container: string;
  image: string;
  info: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
