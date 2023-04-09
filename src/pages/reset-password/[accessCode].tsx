import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config, showToast } from '@/lib';
import { AuthManager } from '@/lib/managers';
import { getMessagesFromError } from '@/lib/utils';
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
      user: {
        newPassword,
        confirmPassword,
        code,
      },
      onSuccessCallback: () => {
        showToast('Password successfully updated!');
        router.push(config.loginRoute);
      },
      onFailCallback: error => {
        showToast('Unable to reset password', getMessagesFromError(error)[0]);
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
        name="password"
        placeholder="Password"
        formRegister={register('newPassword', {
          required: 'Required',
          validate: value => {
            if (!value) return 'Required';
            if (value.length <= 8) return 'Password must be longer than 8 characters';
            return true;
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
          validate: value => {
            if (!value) return 'Required';
            if (value.length <= 8) return 'Password must be longer than 8 characters';
            const newPassword = getValues('newPassword');
            if (value !== newPassword) return 'Passwords Must Match';
            return true;
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
