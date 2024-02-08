import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config, showToast } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import manageUserAccess from '@/lib/managers/AdminUserManager';
import { PermissionService, ValidationService } from '@/lib/services';
import { UserAccessUpdates } from '@/lib/types/apiRequests';
import { UserAccessType } from '@/lib/types/enums';
import { getMessagesFromError } from '@/lib/utils';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';

// This function needs to be moved to the util class after Sean's PR is merged
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
    manageUserAccess({
      user,
      accessType,
      onSuccessCallback: updatedUsers => {
        showToast(`User access type updated for user ${updatedUsers[0].email}!`);
      },
      onFailCallback: error => {
        reportError('Failed to update user access type', error);
      },
    });
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
        name="User Access"
        options={Object.values(UserAccessType)}
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
