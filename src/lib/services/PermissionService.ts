import { PrivateProfile } from '@/lib/types/apiResponses';
import { UserAccessType } from '@/lib/types/enums';

export default class PermissionService {
  static canEditMerchItems(user: PrivateProfile) {
    const validAccess = [UserAccessType.ADMIN, UserAccessType.MERCH_STORE_MANAGER];
    return validAccess.includes(user.accessType);
  }

  /**
   * @returns Array of all possible user access types
   */
  static allUserTypes(): UserAccessType[] {
    const values = Object.values(UserAccessType) as UserAccessType[];
    return values;
  }

  /**
   * @param types to exclude from array
   * @returns Array with all user access types except exclusions
   */
  static allUserTypesExcept(types: UserAccessType[]): UserAccessType[] {
    const values = Object.keys(UserAccessType) as UserAccessType[];
    return values.filter(value => !types.includes(value));
  }
}
