export type Styles = {
  mobileNavItem: string | undefined;
  mobile: boolean;
  content: string;
  header: string;
  headerTitle: string;
  icon: string;
  iconLink: string;
  iconLinks: string;
  navLeft: string;
  portalLinks: string;
  wainbow: string;
  mobileNav: string;
  open: string;
  navItem: string;
  toggleIcon: string;
  bar1: string;
  bar2: string;
  hidden: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
