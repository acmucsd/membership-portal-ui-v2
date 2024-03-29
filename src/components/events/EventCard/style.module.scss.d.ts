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
  container: string;
  image: string;
  info: string;
  infoText: string;
  outlineAi: string;
  outlineCyber: string;
  outlineDesign: string;
  outlineGeneral: string;
  outlineHack: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
