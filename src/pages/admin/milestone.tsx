import { SignInButton, SignInFormItem, SignInTitle } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { config } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { GetServerSideProps, NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';

interface FormValues {
  name: string;
  points: number;
}
const AwardPointsPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = () => {
    // TODO
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <SignInTitle
        text="Create Milestone"
        description="Award points to all active users (e.g. for ACM's 8 year anniversary)"
      />
      <SignInFormItem
        icon={<AiOutlineMail />}
        element="input"
        name="name"
        type="text"
        placeholder="Milestone Name"
        formRegister={register('name', {
          required: 'Required',
        })}
        error={errors.name}
      />
      <SignInFormItem
        icon={<VscLock />}
        name="points"
        element="input"
        type="number"
        placeholder="Point Value"
        formRegister={register('points', {
          required: 'Required',
        })}
        error={errors.points}
      />
      <SignInButton
        type="button"
        display="button1"
        text="Create Milestone"
        onClick={handleSubmit(onSubmit)}
      />
    </VerticalForm>
  );
};

export default AwardPointsPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {
    title: 'Create Milestone',
    description: "Award points to all active users (e.g. for ACM's 8 year anniversary)",
  },
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canAwardPoints,
  { redirectTo: config.admin.homeRoute }
);
