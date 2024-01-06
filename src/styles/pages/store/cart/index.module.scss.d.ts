export type Styles = {
  cartCard: string;
  checkoutButton: string;
  checkoutModal: string;
  checkoutOptions: string;
  confirmation: string;
  confirming: string;
  container: string;
  content: string;
  emptyCart: string;
  header: string;
  main: string;
  pointsSection: string;
  sidebar: string;
  warning: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
