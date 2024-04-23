import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import { config, showToast } from '@/lib';
import { resendEmailVerification } from '@/lib/api/AuthAPI';
import { AuthManager } from '@/lib/managers';
import { CookieService, ValidationService } from '@/lib/services';
import { URL } from '@/lib/types';
import type { LoginRequest } from '@/lib/types/apiRequests';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType, UserState } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';

interface LoginProps {
  destination: URL;
}

const LoginPage: NextPage<LoginProps> = ({ destination }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit: SubmitHandler<LoginRequest> = ({ email, password }) => {
    AuthManager.login({
      email,
      password,
      onSuccessCallback: (user: PrivateProfile) => {
        if (user.state === UserState.PENDING) {
          showToast('Account Not Verified', 'Click to resend a verification email', [
            {
              text: 'Send Email',
              onClick: async () => {
                await resendEmailVerification(user.email);
                showToast(`Verification email sent to ${user.email}!`);
              },
            },
          ]);

          CookieService.clearClientCookies();

          return;
        }
        if (user.state === UserState.BLOCKED) {
          showToast('This account has been disabled', 'Email acm@ucsd.edu if you have questions.');

          CookieService.clearClientCookies();
          return;
        }

        router.push(destination);
      },
      onFailCallback: error => {
        reportError('Unable to login', error);
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle text="Welcome to ACM!" />
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
      <VerticalFormItem
        icon={<VscLock />}
        name="password"
        element="input"
        type="password"
        placeholder="Password"
        formRegister={register('password', {
          required: 'Required',
        })}
        error={errors.password}
      />
      <VerticalFormButton
        type="link"
        display="link"
        text="Forgot your password?"
        href="/forgot-password"
      />
      <VerticalFormButton
        type="button"
        display="button1"
        text="Sign In"
        onClick={handleSubmit(onSubmit)}
      />
      <VerticalFormButton type="link" href="/register" text="Sign Up" display="button2" />
    </VerticalForm>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const user = CookieService.getServerCookie(CookieType.USER, { req, res });
  const authToken = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const route = query?.destination ? decodeURIComponent(query?.destination as string) : null;
  if (user && authToken) {
    return {
      redirect: {
        destination: route || config.homeRoute,
        permanent: false,
      },
    };
  }

  return {
    props: {
      destination: route || config.homeRoute,
    },
  };
};
