import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config, showToast } from '@/lib';
import manageUserAccess from '@/lib/api/UserAccessAPI';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService, ValidationService } from '@/lib/services';
import { UserAccessUpdates } from '@/lib/types/apiRequests';
import { CookieType } from '@/lib/types/enums';
import { getMessagesFromError } from '@/lib/utils';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';

function reportError(title: string, error: unknown) {
  if (error instanceof AxiosError && error.response?.data?.error) {
    showToast(title, getMessagesFromError(error.response.data.error).join('\n\n'));
  } else if (error instanceof Error) {
    showToast(title, error.message);
  } else {
    showToast(title, 'Unknown error');
  }
}

const ManageUserAccessPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserAccessUpdates>();

  const onSubmit: SubmitHandler<UserAccessUpdates> = async ({ user, accessType }) => {
    try {
      const token = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
      const updatedUsers = await manageUserAccess(token, user, accessType);
      if (updatedUsers && updatedUsers.length > 0 && updatedUsers[0]?.email) {
        showToast(`User access type updated for user ${updatedUsers[0].email}!`);
      }
    } catch (error) {
      reportError('Failed to update user access type', error);
    }
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle text="Manage User Access" />
      <SignInFormItem
        icon={<AiOutlineMail />}
        element="input"
        name="user"
        type="email"
        placeholder="Email (user@ucsd.edu)"
        formRegister={register('user', {
          validate: email => {
            const validation = ValidationService.isValidEmail(email);
            return validation.valid || validation.error;
          },
        })}
        error={errors.user}
      />
      <SignInFormItem
        icon={<BsPerson />}
        element="select"
        name="user access"
        options={[
          'RESTRICTED',
          'STANDARD',
          'STAFF',
          'ADMIN',
          'MARKETING',
          'MERCH_STORE_MANAGER',
          'MERCH_STORE_DISTRIBUTOR',
        ]}
        placeholder="User access"
        formRegister={register('accessType')}
        error={errors.user}
      />
      <SignInButton
        type="button"
        display="button1"
        text="Submit"
        onClick={handleSubmit(onSubmit)}
      />
    </VerticalForm>
  );
};

export default ManageUserAccessPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canViewAdminPage,
  config.homeRoute
);
