export type Styles = {
  badge: string;
  badgeAi: string;
  badgeAttended: string;
  badgeCyber: string;
  badgeDesign: string;
  badgeGeneral: string;
  badgeHack: string;
  badgeLive: string;
  badgePoints: string;
  badges: string;
  bordered: string;
  colorChange: string;
  container: string;
  image: string;
  info: string;
  infoText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
