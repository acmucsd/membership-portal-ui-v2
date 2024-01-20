import defaultProfilePictures from '@/lib/constants/profilePictures';
import ranks from '@/lib/constants/ranks';
import type { URL } from '@/lib/types';
import type {
  CustomErrorBody,
  PublicMerchItem,
  PublicProfile,
  ValidatorError,
} from '@/lib/types/apiResponses';
import NoImage from '@/public/assets/graphics/cat404.png';
import {
  type StaticImageData,
  type StaticImport,
  type StaticRequire,
} from 'next/dist/shared/lib/get-img-props';
import { useEffect, useState } from 'react';

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
 * @param user
 * @returns A 32-bit integer
 * @see https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
const hashUser = ({ uuid }: PublicProfile) => {
  return uuid.split('').reduce((hash, char) => {
    /* eslint-disable no-bitwise */
    const hash1 = (hash << 5) - hash + char.charCodeAt(0);
    return hash1 | 0; // Convert to 32bit integer
    /* eslint-enable no-bitwise */
  }, 0);
};

export const getProfilePicture = (user: PublicProfile): URL => {
  if (user.profilePicture) return user.profilePicture;

  const NUM_IMAGES = defaultProfilePictures.length;
  const index = ((hashUser(user) % NUM_IMAGES) + NUM_IMAGES) % NUM_IMAGES;
  const path = defaultProfilePictures[index]?.src ?? '';

  return path;
};

/**
 * Retrieves the level from the number of points.
 * @param {number} points The number of the points the user has.
 * @return {number} The current level of the user.
 */
export const getLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
};

/**
 * Get a user's rank based on how many points they have
 * @param points
 * @returns rank name
 */
export const getUserRank = (points: number): string => {
  const index = Math.min(ranks.length, getLevel(points)) - 1;
  return ranks[index] as string;
};

/**
 * Checks whether a next/image Image source is a gif
 * @param src - source of the image
 * @returns whether or not the source is a gif
 */
export const isSrcAGif = (src: string | StaticImport): boolean => {
  const srcString =
    (typeof src === 'string' && src) ||
    (src as StaticRequire).default?.src ||
    (src as StaticImageData).src;
  return /\.gif($|&)/.test(srcString);
};

/**
 * A React hook for calling `URL.createObjectURL` on the given file. Avoids
 * re-generating the URL on re-render, and frees memory by revoking the old URL
 * when unmounted or the file changes.
 * @param file - `File` or `Blob` object to create a URL for.
 * @returns The object URL. Defaults an empty string if `file` is empty.
 */
export function useObjectUrl(file?: Blob | null): string {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!file) {
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return url;
}

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
      to = now;
      break;
    }
    case 'past-month': {
      from = now - DAY_SECONDS * 28;
      to = now;
      break;
    }
    case 'past-year': {
      from = now - DAY_SECONDS * 365;
      to = now;
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

/**
 * Returns the default (first) photo for a merchandise item.
 * If there are no photos for this item, returns the default 404 image.
 */
export const getDefaultMerchItemPhoto = (item: PublicMerchItem | undefined): string => {
  if (item && item.merchPhotos.length > 0) {
    // Get the photo with the smallest position.
    const defaultPhoto = item.merchPhotos.reduce((prevImage, currImage) => {
      return prevImage.position < currImage.position ? prevImage : currImage;
    });
    return defaultPhoto.uploadedPhoto;
  }
  return NoImage.src;
};

/**
 * Prepend 'http://' to a url if a protocol isn't specified
 * @param url url to be fixed
 * @returns url begnning with http://
 */
export const fixUrl = (input: string, prefix?: string): string => {
  // Return input as-is if it's blank or includes a protocol
  if (!input || input.includes('://')) {
    return input;
  }
  // Encourage https://
  if (prefix && input.startsWith('http://')) {
    return input.replace('http', 'https');
  }
  // If the user typed in their username
  if (prefix && /^[\w.-]+(?<!\.com)\/?$/.test(input)) {
    return `https://${prefix}/${input}`;
  }
  // Add https:// if it was left out
  return `https://${input}`;
};
