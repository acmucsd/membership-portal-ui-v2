export type Styles = {
  bar1: string;
  bar2: string;
  content: string;
  header: string;
  headerTitle: string;
  hidden: string;
  icon: string;
  iconLink: string;
  iconLinks: string;
  mobile: string;
  mobileNav: string;
  mobileNavItem: string;
  navLeft: string;
  open: string;
  portalLinks: string;
  toggleIcon: string;
  wainbow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
