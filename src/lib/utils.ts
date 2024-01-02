import defaultProfilePictures from '@/lib/constants/profilePictures';
import { URL } from '@/lib/types';
import type { CustomErrorBody, PublicProfile, ValidatorError } from '@/lib/types/apiResponses';

/**
 * Get next `num` years from today in a number array to generate dropdown options for future selections
 * @param num of year entries to generate
 * @returns array of the next `num` years
 */
export const getNextNYears = (num: number) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: num }, (_, i) => i + currentYear);
};

/**
 * Parse nested error object for messages
 * @param errBody Obj with validator constraint errors
 * @returns List of all user-friendly error strings
 */
export const getMessagesFromError = (errBody: CustomErrorBody): string[] => {
  // if error has no suberrors, just return top level error message
  if (!errBody.errors) return [errBody.message];

  // recursive function to get all error messages into one list
  const getAllErrMessages = (err: ValidatorError): string[] => [
    ...Object.values(err.constraints ?? {}),
    ...err.children.map(child => getAllErrMessages(child)).flat(),
  ];

  return errBody.errors.map(err => getAllErrMessages(err)).flat();
};

export const copy = async (text: string): Promise<void> => {
  if (window === undefined) return;
  await window.navigator.clipboard.writeText(text);
};

/**
 * Function to trim given text to max character length
 * @param text String text input
 * @param len Maximum length
 * @returns Formatted text
 */
export const trim = (text: string, len: number) => {
  return text.length > len ? `${text.substring(0, len - 3)}...` : text;
};

/**
 * Given some text, returns a formatted string where the first letter is capitalized
 * and all other letters are lowercase.
 * @param text String text input
 * @returns Formatted text
 */
export const capitalize = (text: string): string => {
  return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Given text, removes all non alphanumeric characters.
 * This makes search terms more lenient.
 */
export const formatSearch = (text: string): string => {
  return text.toLowerCase().replace(/[^0-9a-zA-Z]/g, '');
};

/**
 * Helper function to map each user to a numeric value deterministically
 * TODO: Use the user's UUID to hash to a number since it will never change
 * @param user
 * @returns
 */
const hashUser = (user: PublicProfile) => {
  return user.points;
};

export const getProfilePicture = (user: PublicProfile): URL => {
  if (user.profilePicture) return user.profilePicture;

  const NUM_IMAGES = defaultProfilePictures.length;
  const index = hashUser(user) % NUM_IMAGES;
  const path = defaultProfilePictures[index]?.src ?? '';

  return path;
};

// TODO: Define all ranks and logic for this
export const getUserRank = (user: PublicProfile): string => {
  const ranks = ['Polynomial Pita', 'Factorial Flatbread'];
  const index = user.points % 2;

  return ranks[index] ?? '';
};

/**
 * Checks whether an image source is a gif
 * @param src - source of the image
 * @returns whether or not the source is a gif
 */
export const isSrcAGif = (src: string): boolean => /\.gif($|&)/.test(src);

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const dateFormatWithYear = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const formatDate = (date: Date | string, year?: boolean): string => {
  const format = year ? dateFormatWithYear : dateFormat;
  return format.format(new Date(date));
};

export const formatEventDate = (
  start: Date | string,
  end: Date | string,
  year?: boolean
): string => {
  const format = year ? dateFormatWithYear : dateFormat;
  try {
    return format.formatRange(new Date(start), new Date(end));
  } catch {
    return `Invalid date range: ${new Date(start)}, ${new Date(end)}`;
  }
};

export const formatURLEventTitle = (title: string): string => {
  return encodeURIComponent(title.toLowerCase().trim().replace(/ /g, '-'));
};

/** Year ACM was founded. */
const START_YEAR = 2019;
/** Number of seconds in a day. */
const DAY_SECONDS = 86400;

/**
 * @returns The end of the current academic year.
 */
export const getEndYear = (): number => {
  const today = new Date();
  // Arbitrarily start the next academic year in August
  return today.getMonth() < 7 ? today.getFullYear() : today.getFullYear() + 1;
};

/**
 * @returns A list of all years that ACM has existed.
 */
export const getYears = () => {
  const endYear = getEndYear();
  const years = [];
  for (let year = START_YEAR; year < endYear; year += 1) {
    years.unshift({ value: String(year), label: `${year}–${year + 1}` });
  }
  return years;
};

/**
 * Given a sort option, returns the range of times to filter events/attendances by.
 * @param sort Either a year (2023, 2019, etc.) or a string option (past-week, all-time, etc.)
 * @returns A range of times to filter results by.
 */
export const getDateRange = (sort: string | number) => {
  const now = Date.now() / 1000;
  let from;
  let to;
  switch (sort) {
    case 'upcoming': {
      from = now;
      break;
    }
    case 'past-week': {
      from = now - DAY_SECONDS * 7;
      break;
    }
    case 'past-month': {
      from = now - DAY_SECONDS * 28;
      break;
    }
    case 'past-year': {
      from = now - DAY_SECONDS * 365;
      break;
    }
    case 'all-time': {
      break;
    }
    default: {
      const year = +sort;
      // Arbitrarily academic years on August 1, which should be during the summer
      from = new Date(year, 7, 1).getTime() / 1000;
      to = new Date(year + 1, 7, 1).getTime() / 1000;
    }
  }
  return { from, to };
};
