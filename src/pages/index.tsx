import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { showToast } from '@/lib';
import { AuthManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import { Url } from '@/lib/types';
import { LoginRequest } from '@/lib/types/apiRequests';
import { CookieType } from '@/lib/types/enums';
import { getMessagesFromError } from '@/lib/utils';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';
import isEmail from 'validator/lib/isEmail';

interface LoginProps {
  redirect: Url;
}

const LoginPage: NextPage<LoginProps> = ({ redirect = '/portal' }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit: SubmitHandler<LoginRequest> = ({ email, password }: LoginRequest) => {
    AuthManager.login({
      email,
      password,
      onSuccessCallback: () => router.push(redirect),
      onFailCallback: error => {
        showToast('Unable to login', getMessagesFromError(error).join('; '));
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle text="Welcome to ACM!" />
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
      <SignInFormItem
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
      <SignInButton
        type="link"
        display="link"
        text="Forgot your password?"
        href="/forgot-password"
      />
      <SignInButton
        type="button"
        display="button1"
        text="Sign In"
        onClick={handleSubmit(onSubmit)}
      />
      <SignInButton type="link" href="/register" text="Sign Up" display="button2" />
    </VerticalForm>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });
  const { redirect = '/portal' } = query;

  // Will never be a string[], don't have to worry about this
  const redirectTo = redirect as string;

  if (userCookie) {
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    };
  }

  return {
    props: {
      redirect: redirectTo,
    },
  };
};
