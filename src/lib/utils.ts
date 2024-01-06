import defaultProfilePictures from '@/lib/constants/profilePictures';
import type { URL } from '@/lib/types';
import type {
  CustomErrorBody,
  PublicMerchItem,
  PublicProfile,
  ValidatorError,
} from '@/lib/types/apiResponses';
import NoImage from '@/public/assets/graphics/cat404.png';
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
  console.log(errBody);
  if (!errBody?.errors) return [errBody?.message];

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

/**
 * Retrieves the level from the number of points.
 * @param {number} points The number of the points the user has.
 * @return {number} The current level of the user.
 */
export const getLevel = (points: number): number => {
  return Math.floor(points / 100) + 1;
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
export const isSrcAGif = (src: string | null): boolean => src !== null && /\.gif($|&)/.test(src);

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
 * Format a string so exactly its first character is capitalized.
 * @param str
 * @returns sentence case version of `str`
 */
export const toSentenceCase = (str: string) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
