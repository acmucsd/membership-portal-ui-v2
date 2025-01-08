import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import { showToast, config } from '@/lib';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';

import { AdminAPI, EventAPI } from '@/lib/api';

import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail, AiOutlineCalendar } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';

interface FormValues {
  event: string;
  email: string[];
  description: string;
  points: number;
}

interface AwardPointsPageProps {
  title: string;
  description: string;
  properEvents: (number | string)[];
  authToken: string;
  sortedEmails: string[];
}

const AwardPointsPage: NextPage<AwardPointsPageProps> = ({
  properEvents,
  authToken,
  sortedEmails,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({ email, description, points }) => {
    try {
      const parsedPoints = Number(points);

      await AdminAPI.addBonus(authToken, email, description, parsedPoints);

      showToast('Successfully awarded points!');
    } catch (error) {
      showToast('An error occurred!');
    }
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle
        text="Award Bonus Points"
        description="Grant Bonus Points to a Specific User"
      />

      <VerticalFormItem
        icon={<AiOutlineCalendar />}
        element="select"
        name="event"
        options={properEvents}
        placeholder="Select an Event"
        formRegister={register('event', {
          required: 'Required',
        })}
        error={errors.event}
      />
      <VerticalFormItem
        icon={<AiOutlineMail />}
        element="select-multiple"
        name="email"
        options={sortedEmails}
        placeholder=""
        formRegister={register('email', {
          required: 'Required',
        })}
        error={errors.email}
      />

      <VerticalFormItem
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
      <VerticalFormItem
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
      <VerticalFormButton
        type="button"
        display="button1"
        text="Award Points"
        onClick={() => {
          handleSubmit(onSubmit)(); // Ensure this is called
        }}
      />
    </VerticalForm>
  );
};

export default AwardPointsPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ authToken }) => {
  const allEvents = await EventAPI.getAllEvents();
  const allUsers = await AdminAPI.getAllUserEmails(authToken);

  const properEvents = allEvents.map(event => event.title);
  const properEmails = allUsers.map(user => user.email);
  const sortedEmails = properEmails.sort((a, b) => a.localeCompare(b));

  return {
    props: {
      title: 'Award Bonus Points',
      description: 'Grant bonus points to a specific user',
      properEvents,
      authToken,
      sortedEmails,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canAwardPoints,
  { redirectTo: config.admin.homeRoute }
);
