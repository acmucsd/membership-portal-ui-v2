import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
} from '@/components/common';
import { showToast, config } from '@/lib';
import { PermissionService } from '@/lib/services';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import type { NextPage } from 'next';
import { AdminAPI, EventAPI } from '@/lib/api';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineArrowDown, AiOutlineCalendar } from 'react-icons/ai';
import { PublicEvent } from '@/lib/types/apiResponses';

interface FormValues {
  email: string[];
  event: string;
}
interface AwardPointsPageProps {
  title: string;
  description: string;
  allEvents: PublicEvent[];
  authToken: string;
  sortedEmails: string[];
}
const AwardPointsPage: NextPage<AwardPointsPageProps> = ({
  allEvents,
  authToken,
  sortedEmails,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const eventDict = Object.fromEntries(allEvents.map(event => [event.title, event.uuid]));

  const onSubmit: SubmitHandler<FormValues> = async ({ email, event }) => {
    try {
      const selectedUUID: string | undefined = eventDict[event];
      await AdminAPI.addAttendance(authToken, email, selectedUUID || '');
      showToast('Successfully awarded attendance!');
    } catch (error) {
      showToast('An error occurred');
    }
    
  };

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle
        text="Retroactive Attendance"
        description="Mark members as attended for past events"
      />
      <VerticalFormItem
        icon={<AiOutlineArrowDown />}
        element="select-multiple"
        name="email"
        options={sortedEmails}
        placeholder="User Email (user@ucsd.edu)"
        formRegister={register('email', {
          required: 'Required',
        })}
        error={errors.email}
      />
      <VerticalFormItem
        icon={<AiOutlineCalendar />}
        element="select"
        name="event"
        options={allEvents.map(event => event.title)}
        placeholder="Select an Event"
        formRegister={register('event', {
          required: 'Required',
        })}
        error={errors.event}
      />

      <VerticalFormButton
        type="button"
        display="button1"
        text="Award Points"
        onClick={handleSubmit(onSubmit)}
      />
    </VerticalForm>
  );
};

export default AwardPointsPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ authToken }) => {
  const allEvents = await EventAPI.getAllPastEvents();

  const allUsers = await AdminAPI.getAllUserEmails(authToken);

  const properEmails = allUsers.map(user => user.email);
  const sortedEmails = properEmails.sort((a, b) => a.localeCompare(b));

  return {
    props: {
      title: 'Retroactive Attendance',
      description: 'Mark members as attended for past events',
      allEvents,
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
