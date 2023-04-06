import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import data from '@/lib/constants/majors.json';
import { AuthManager } from '@/lib/managers';
import showToast from '@/lib/showToast';
import { UserRegistration } from '@/lib/types/apiRequests';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { getMessagesFromError, getNextNYears } from '@/lib/utils';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { IoBookOutline } from 'react-icons/io5';
import { SlGraduation } from 'react-icons/sl';
import { VscLock } from 'react-icons/vsc';
import isEmail from 'validator/lib/isEmail';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  major: string;
  graduationYear: number;
}

const RegisterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const router = useRouter();

  const onSubmit: SubmitHandler<UserRegistration> = (userRegistration: UserRegistration) => {
    AuthManager.register({
      ...userRegistration,
      onSuccessCallback: (user: PrivateProfile) => {
        router.push(`/check-email?email=${encodeURIComponent(user.email)}`);
      },
      onFailCallback: error => {
        showToast('Error with registration!', getMessagesFromError(error)[0]);
      },
    });
  };

  return (
    <VerticalForm
      style={{
        gap: '4px',
      }}
      onEnterPress={handleSubmit(onSubmit)}
    >
      <SignInTitle text="Become a Member" />
      <SignInFormItem
        icon={<BsPerson />}
        name="firstName"
        type="text"
        element="input"
        placeholder="First Name"
        error={errors.firstName}
        formRegister={register('firstName', {
          required: 'Required',
        })}
      />
      <SignInFormItem
        icon={<BsPerson />}
        name="lastName"
        type="text"
        element="input"
        placeholder="Last Name"
        error={errors.lastName}
        formRegister={register('lastName', {
          required: 'Required',
        })}
      />
      <SignInFormItem
        icon={<AiOutlineMail />}
        name="email"
        type="email"
        element="input"
        placeholder="UCSD Email"
        error={errors.email}
        formRegister={register('email', {
          required: 'Required',
          validate: str => isEmail(str) || 'Invalid email address',
        })}
      />
      <SignInFormItem
        icon={<VscLock />}
        name="password"
        type="password"
        element="input"
        placeholder="Password"
        error={errors.password}
        formRegister={register('password', {
          validate: value => {
            if (!value) return 'Required';
            if (value.length <= 8) return 'Password must be longer than 8 characters';
            return true;
          },
        })}
      />
      <SignInFormItem
        icon={<VscLock />}
        name="confirmPassword"
        type="password"
        element="input"
        placeholder="Confirm Password"
        error={errors.confirmPassword}
        formRegister={register('confirmPassword', {
          validate: value => {
            if (!value) return 'Required';
            if (value.length <= 8) return 'Password must be longer than 8 characters';
            const password = getValues('password');
            if (value !== password) return 'Passwords Must Match';
            return true;
          },
        })}
      />
      <SignInFormItem
        icon={<IoBookOutline />}
        name="major"
        options={data.majors}
        element="select"
        placeholder="Major"
        error={errors.major}
        formRegister={register('major')}
      />
      <SignInFormItem
        icon={<SlGraduation />}
        name="major"
        element="select"
        options={getNextNYears(6)}
        placeholder="Graduation Year"
        error={errors.graduationYear}
        formRegister={register('graduationYear', {
          valueAsNumber: true,
        })}
      />
      <SignInButton
        type="button"
        display="button1"
        text="Sign Up"
        onClick={handleSubmit(onSubmit)}
      />
      <SignInButton
        type="link"
        display="link"
        style={{
          textAlign: 'center',
          marginTop: '0.5rem',
        }}
        href="/"
        text={
          <span>
            Already have an account? <b>Sign in.</b>
          </span>
        }
      />
    </VerticalForm>
  );
};

export default RegisterPage;
