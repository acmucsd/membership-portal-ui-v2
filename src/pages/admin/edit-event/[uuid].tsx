import { config } from '@/lib';
import { EventAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next/types';
import { useState } from 'react';

interface EditEventProps {
  editEvent: PublicEvent;
}

const EditEvent = ({ editEvent }: EditEventProps) => {
  const [eventWithChanges, setEventWithChanges] = useState(editEvent);

  return <pre>{JSON.stringify(editEvent, null, 2)}</pre>;
};

export default EditEvent;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const editEvent = await EventAPI.getEvent(uuid, token);
    return {
      props: {
        editEvent,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.admin, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canManageEvents(),
  config.admin
);
