import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import VerticalForm from '@/components/common/VerticalForm';
import { config, showToast } from '@/lib';
import { resendEmailVerification } from '@/lib/api/AuthAPI';
import { AuthManager } from '@/lib/managers';
import { CookieService, ValidationService } from '@/lib/services';
import { URL } from '@/lib/types';
import { LoginRequest } from '@/lib/types/apiRequests';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { UserState } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';

interface LoginProps {
  destination: URL;
  full?: boolean;
}

const Login = ({ destination, full }: LoginProps) => {
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
    <VerticalForm onEnterPress={handleSubmit(onSubmit)} style={{ height: full ? '' : 'auto' }}>
      {full ? <SignInTitle text="Welcome to ACM!" /> : null}
      <SignInFormItem
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
      {full ? (
        <SignInButton type="link" href={config.registerRoute} text="Sign Up" display="button2" />
      ) : null}
    </VerticalForm>
  );
};

export default Login;
