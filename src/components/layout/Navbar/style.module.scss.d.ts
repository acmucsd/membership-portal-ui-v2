export type Styles = {
  bar1: string;
  bar2: string;
  content: string;
  header: string;
  headerTitle: string;
  icon: string;
  iconLink: string;
  iconLinks: string;
  loggedOut: string;
  mobileNav: string;
  mobileNavItem: string;
  mobileSwitch: string;
  navLeft: string;
  portalLinks: string;
  toggleIcon: string;
  wainbow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
