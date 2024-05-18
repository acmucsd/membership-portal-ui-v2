import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import majors from '@/lib/constants/majors';
import { AuthManager } from '@/lib/managers';
import { ValidationService } from '@/lib/services';
import type { UserRegistration } from '@/lib/types/apiRequests';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { getNextNYears, reportError } from '@/lib/utils';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { IoBookOutline } from 'react-icons/io5';
import { SlGraduation } from 'react-icons/sl';
import { VscLock } from 'react-icons/vsc';

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

  const onSubmit: SubmitHandler<UserRegistration> = userRegistration => {
    AuthManager.register({
      ...userRegistration,
      onSuccessCallback: (user: PrivateProfile) => {
        router.push(`/check-email?email=${encodeURIComponent(user.email)}`);
      },
      onFailCallback: error => {
        reportError('Error with registration!', error);
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
      <VerticalFormTitle text="Become a Member" />
      <VerticalFormItem
        icon={<BsPerson />}
        name="firstName"
        type="text"
        element="input"
        placeholder="First Name"
        error={errors.firstName}
        formRegister={register('firstName', {
          required: 'Required',
        })}
        inputHeight="1.5rem"
      />
      <VerticalFormItem
        icon={<BsPerson />}
        name="lastName"
        type="text"
        element="input"
        placeholder="Last Name"
        error={errors.lastName}
        formRegister={register('lastName', {
          required: 'Required',
        })}
        inputHeight="1.5rem"
      />
      <VerticalFormItem
        icon={<AiOutlineMail />}
        name="email"
        type="email"
        element="input"
        placeholder="UCSD Email"
        error={errors.email}
        formRegister={register('email', {
          validate: email => {
            const validation = ValidationService.isValidEmail(email);
            return validation.valid || validation.error;
          },
        })}
        inputHeight="1.5rem"
      />
      <VerticalFormItem
        icon={<VscLock />}
        name="password"
        type="password"
        element="input"
        placeholder="Password"
        error={errors.password}
        formRegister={register('password', {
          validate: password => {
            const validation = ValidationService.isValidPassword(password);
            return validation.valid || validation.error;
          },
        })}
        inputHeight="1.5rem"
      />
      <VerticalFormItem
        icon={<VscLock />}
        name="confirmPassword"
        type="password"
        element="input"
        placeholder="Confirm Password"
        error={errors.confirmPassword}
        formRegister={register('confirmPassword', {
          validate: confirmPassword => {
            const validPassword = ValidationService.isValidPassword(confirmPassword);
            const matchingPassword = ValidationService.isMatchingPassword(
              confirmPassword,
              getValues('password')
            );
            if (!validPassword.valid) return validPassword.error;
            return matchingPassword.valid || matchingPassword.error;
          },
        })}
        inputHeight="1.5rem"
      />
      <VerticalFormItem
        icon={<IoBookOutline />}
        name="major"
        options={majors}
        element="select"
        placeholder="Major"
        error={errors.major}
        formRegister={register('major')}
        inputHeight="1.25rem"
      />
      <VerticalFormItem
        icon={<SlGraduation />}
        name="major"
        element="select"
        options={getNextNYears(6)}
        placeholder="Graduation Year"
        error={errors.graduationYear}
        formRegister={register('graduationYear', {
          valueAsNumber: true,
        })}
        inputHeight="1.25rem"
      />
      <VerticalFormButton
        type="button"
        display="button1"
        text="Sign Up"
        onClick={handleSubmit(onSubmit)}
      />
      <VerticalFormButton
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

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { title: 'Become a Member' },
});
