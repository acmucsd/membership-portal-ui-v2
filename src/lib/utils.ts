import type { CustomErrorBody, ValidatorError } from '@/lib/types/apiResponses';

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

/**
 * Get a random default avatar
 * @returns string path to an avatar .png, suitable for use as src for a Next Image component
 */
export const getDefaultAvatarSrc = (): string => {
  const PROFILE_PIC_PATH = '/assets/profile-pics/';
  const NUM_PROFILE_PICS = 9;

  const i = Math.floor(Math.random() * NUM_PROFILE_PICS);
  return `${PROFILE_PIC_PATH}adorable${i}.png`;
};
