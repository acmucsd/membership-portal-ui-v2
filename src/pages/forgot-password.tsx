import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import { config, showToast } from '@/lib';
import { AuthManager } from '@/lib/managers';
import { ValidationService } from '@/lib/services';
import type { SendPasswordResetEmailRequest } from '@/lib/types/apiRequests';
import { reportError } from '@/lib/utils';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';

const ForgotPassword: NextPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendPasswordResetEmailRequest>();

  const onSubmit: SubmitHandler<SendPasswordResetEmailRequest> = ({ email }) => {
    AuthManager.sendPasswordResetEmail({
      email,
      onSuccessCallback: () => {
        router.push(config.loginRoute);
        showToast('Success! Check your email shortly', `Email has been sent to ${email}`);
      },
      onFailCallback: error => {
        reportError('Error with email!', error);
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle text="Forgot Password" />
      <VerticalFormItem
        icon={<AiOutlineMail />}
        element="input"
        name="email"
        type="email"
        placeholder="Email (user@ucsd.edu)"
        formRegister={register('email', {
          validate: email => {
            const validation = ValidationService.isValidEmail(email);
            return validation.valid || validation.error;
          },
        })}
        error={errors.email}
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

export default ForgotPassword;

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { title: 'Forgot Password' },
});
