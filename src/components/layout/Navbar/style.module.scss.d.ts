export type Styles = {
  active: string;
  navItems: string;
  navLink: string;
  navMenu: string;
  navSection: string;
  sectionHeader: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
