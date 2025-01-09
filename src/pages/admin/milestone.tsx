import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import { showToast, config } from '@/lib';
import { AdminAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineStar } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';

interface FormValues {
  name: string;
  points: number;
}

interface AwardPointsPageProps {
  authToken: string;
}
const AwardPointsPage: NextPage<AwardPointsPageProps> = ({ authToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({ name, points }) => {
    try {
      await AdminAPI.createMilestone(authToken, name, Number(points));
      showToast('Successfully awarded attendance!');
    } catch (error) {
      showToast('Error found!');
    }
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle
        text="Create Milestone"
        description="Award points to all active users (e.g. for ACM's 8 year anniversary)"
      />
      <VerticalFormItem
        icon={<AiOutlineStar />}
        element="input"
        name="name"
        type="text"
        placeholder="Milestone Name"
        formRegister={register('name', {
          required: 'Required',
        })}
        error={errors.name}
      />
      <VerticalFormItem
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
      <VerticalFormButton
        type="button"
        display="button1"
        text="Create Milestone"
        onClick={handleSubmit(onSubmit)}
      />
    </VerticalForm>
  );
};

export default AwardPointsPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ authToken }) => ({
  props: {
    title: 'Create Milestone',
    description: "Award points to all active users (e.g. for ACM's 8 year anniversary)",
    authToken,
  },
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canAwardPoints,
  { redirectTo: config.admin.homeRoute }
);
