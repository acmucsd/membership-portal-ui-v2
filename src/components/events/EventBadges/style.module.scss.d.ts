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
  pulse: string;
  pulse2: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
