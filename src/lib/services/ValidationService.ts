import isEmail from 'validator/lib/isEmail';

interface ValidationSuccess {
  valid: true;
  error: null;
}

interface ValidationError {
  valid: false;
  error: string;
}
type ValidationResponse = ValidationSuccess | ValidationError;

const success: ValidationResponse = {
  valid: true,
  error: null,
};

const validationError = (msg: string): ValidationResponse => ({
  valid: false,
  error: msg,
});

/**
 * Wrapper functions to handle all logic for validating common input data field types
 */
export const isValidPassword = (password: string): ValidationResponse => {
  if (!password) return validationError('Required');
  if (password.length <= 8) return validationError('Password must be longer than 8 characters');
  return success;
};

export const isMatchingPassword = (
  password: string,
  comparePassword: string
): ValidationResponse => {
  if (password !== comparePassword) return validationError('Passwords Must Match');
  return success;
};
export const isValidEmail = (email: string): ValidationResponse => {
  if (!email) return validationError('Required');
  if (!isEmail(email)) return validationError('Invalid email address');
  return success;
};
