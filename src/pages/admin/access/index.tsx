import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import { showToast } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import manageUserAccess from '@/lib/managers/AdminUserManager';
import { PermissionService, ValidationService } from '@/lib/services';
import { UserAccessUpdates } from '@/lib/types/apiRequests';
import { UserAccessType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { GetServerSideProps } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';

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
        showToast(`User access type updated for user ${updatedUsers[0]?.email}!`);
      },
      onFailCallback: error => {
        reportError('Failed to update user access type', error);
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle text="Manage User Access" />
      <VerticalFormItem
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
      <VerticalFormItem
        icon={<BsPerson />}
        element="select"
        name="User Access"
        options={Object.values(UserAccessType).filter(option => option !== 'ADMIN')}
        formRegister={register('accessType')}
        error={errors.user}
        placeholder=""
      />
      <VerticalFormButton
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
  PermissionService.canViewAdminPage
);
