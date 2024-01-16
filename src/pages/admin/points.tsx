import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config, showToast } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService, ValidationService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps, NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';

interface FormValues {
  email: string;
  description: string;
  points: number;
}
const AwardPointsPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({ email, description, points }) => {
    // TODO
    const token = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    const response = await EventAPI.awardBonusPoints(token, email, points, description);
    showToast(`Successfully awarded bonus points for ${JSON.stringify(response.emails)}`);
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle text="Award Bonus Points" description="Grant Bonus Points to a Specific User" />
      <SignInFormItem
        icon={<AiOutlineMail />}
        element="input"
        name="email"
        type="email"
        placeholder="User Email (user@ucsd.edu)"
        formRegister={register('email', {
          validate: email => {
            const validation = ValidationService.isValidEmail(email);
            return validation.valid || validation.error;
          },
        })}
        error={errors.email}
      />
      <SignInFormItem
        icon={<AiOutlineMail />}
        element="input"
        name="description"
        type="text"
        placeholder="Description"
        formRegister={register('description', {
          required: 'Required',
        })}
        error={errors.description}
      />
      <SignInFormItem
        icon={<VscLock />}
        name="points"
        element="input"
        type="number"
        placeholder="Point Value"
        formRegister={register('points', {
          required: 'Required',
          valueAsNumber: true,
        })}
        error={errors.points}
      />
      <SignInButton
        type="button"
        display="button1"
        text="Award Points"
        onClick={handleSubmit(onSubmit)}
      />
    </VerticalForm>
  );
};

export default AwardPointsPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canAwardPoints,
  config.admin.homeRoute
);
