export type Styles = {
  active: string;
  container: string;
  controls: string;
  controlsLeft: string;
  createNewEvent: string;
  eventCardContainer: string;
  header: string;
  inactive: string;
  modeControls: string;
  pagination: string;
  paginationSizeControl: string;
  searchBar: string;
  searchInput: string;
  viewControls: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
