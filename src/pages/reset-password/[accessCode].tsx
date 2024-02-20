import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config, showToast } from '@/lib';
import { AuthManager } from '@/lib/managers';
import { ValidationService } from '@/lib/services';
import { reportError } from '@/lib/utils';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { VscLock } from 'react-icons/vsc';

interface ResetPasswordProps {
  code: string;
}

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = ({ code }: ResetPasswordProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const onSubmit: SubmitHandler<ResetPasswordForm> = ({ newPassword, confirmPassword }) => {
    AuthManager.resetPassword({
      code,
      user: {
        newPassword,
        confirmPassword,
      },
      onSuccessCallback: () => {
        showToast('Password successfully updated!');
        router.push(config.loginRoute);
      },
      onFailCallback: error => {
        reportError('Unable to reset password', error);
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle text="Reset Password" />
      <SignInFormItem
        icon={<VscLock />}
        type="password"
        element="input"
        name="newPassword"
        placeholder="Password"
        formRegister={register('newPassword', {
          validate: newPassword => {
            const validation = ValidationService.isValidPassword(newPassword);
            return validation.valid || validation.error;
          },
        })}
        error={errors.newPassword}
      />
      <SignInFormItem
        icon={<VscLock />}
        type="password"
        element="input"
        name="confirmPassword"
        placeholder="Confirm Password"
        formRegister={register('confirmPassword', {
          required: 'Required',
          validate: confirmPassword => {
            const validPassword = ValidationService.isValidPassword(confirmPassword);
            const matchingPassword = ValidationService.isMatchingPassword(
              confirmPassword,
              getValues('newPassword')
            );
            if (!validPassword.valid) return validPassword.error;
            return matchingPassword.valid || matchingPassword.error;
          },
        })}
        error={errors.confirmPassword}
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

export default ResetPasswordPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.accessCode as string;
  return {
    props: {
      code,
    },
  };
};
