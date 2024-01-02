import { UserAccessType } from '@/lib/types/enums';

/**
 * Wrapper class to manage permissions by helping setting restrictions and validating permissions across the application
 */
export const canEditMerchItems = (): UserAccessType[] => {
  return [UserAccessType.ADMIN, UserAccessType.MERCH_STORE_MANAGER];
};

export const canManageEvents = (): UserAccessType[] => {
  return [UserAccessType.ADMIN, UserAccessType.MARKETING];
};

export const canViewAdminPage = (): UserAccessType[] => {
  return [
    UserAccessType.ADMIN,
    UserAccessType.MARKETING,
    UserAccessType.MERCH_STORE_MANAGER,
    UserAccessType.MERCH_STORE_DISTRIBUTOR,
  ];
};

/**
 * @param types to exclude from array
 * @returns Array with all user access types except exclusions
 */
export const allUserTypesExcept = (types: UserAccessType[]): UserAccessType[] => {
  const values = Object.keys(UserAccessType) as UserAccessType[];
  return values.filter(value => !types.includes(value));
};

/**
 * @returns Valid logged in user types
 */
export const loggedInUser = (): UserAccessType[] => {
  return allUserTypesExcept([UserAccessType.RESTRICTED]);
};
