import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { showToast } from '@/lib';
import { EventManager } from '@/lib/managers';
import { ValidationService } from '@/lib/services';
import type { ExpressCheckInRequest } from '@/lib/types/apiRequests';
import { getMessagesFromError } from '@/lib/utils';
import type { GetServerSideProps, NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineKey, AiOutlineMail } from 'react-icons/ai';

interface CheckinProps {
  code: string;
}

const ExpressCheckInPage: NextPage<CheckinProps> = ({ code }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpressCheckInRequest>();

  const onSubmit: SubmitHandler<ExpressCheckInRequest> = ({ attendanceCode, email }) => {
    EventManager.expressCheckIn({
      attendanceCode,
      email,
      onSuccessCallback: response => {
        const title = `Checked in to ${response.title}!`;
        const subtitle = `Thanks for checking in! You earned ${response.pointValue} points.`;
        showToast(title, subtitle);
      },
      onFailCallback: error => {
        showToast('Unable to express check in', getMessagesFromError(error)[0]);
      },
    });
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle text="Express Check-In" />
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
        icon={<AiOutlineKey />}
        element="input"
        name="checkin code"
        type="checkin code"
        placeholder="Checkin Code"
        // auto fill in the checkin code with the query parameter
        value={code}
        formRegister={register('attendanceCode', {
          required: 'Required',
        })}
        error={errors.attendanceCode}
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

export default ExpressCheckInPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const code = query.destination?.slice(query.destination.indexOf('=') + 1);
  if (typeof code === 'string') {
    return {
      props: {
        code,
      },
    };
  }
  return {
    props: {
      code: '',
    },
  };
};
