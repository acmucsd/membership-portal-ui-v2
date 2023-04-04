import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config, showToast } from '@/lib';
import { AuthManager } from '@/lib/managers';
import type { SendPasswordResetEmailRequest } from '@/lib/types/apiRequests';
import { getMessagesFromError } from '@/lib/utils';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import isEmail from 'validator/lib/isEmail';

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendPasswordResetEmailRequest>();

  const onSubmit: SubmitHandler<SendPasswordResetEmailRequest> = ({
    email,
  }: SendPasswordResetEmailRequest) => {
    AuthManager.sendPasswordResetEmail({
      email,
      onSuccessCallback: () => {
        router.push(config.loginRoute);
        showToast('Success! Check your email shortly', `Email has been sent to ${email}`);
      },
      onFailCallback: error => {
        showToast('Error with email!', getMessagesFromError(error)[0]);
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle text="Forgot Password" />
      <SignInFormItem
        icon={<AiOutlineMail />}
        element="input"
        name="email"
        type="email"
        placeholder="Email (user@ucsd.edu)"
        formRegister={register('email', {
          required: 'Required',
          validate: str => isEmail(str) || 'Invalid email address',
        })}
        error={errors.email}
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

export default ForgotPassword;
