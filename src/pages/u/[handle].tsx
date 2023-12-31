import EventCarousel from '@/components/events/EventCarousel';
import { config } from '@/lib';
import { EventAPI, UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicAttendance, PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next/types';

interface UserProfilePageProps {
  user: PublicProfile;
  attendances: PublicAttendance[];
}

const UserProfilePage = ({ user, attendances }: UserProfilePageProps) => {
  const events = attendances.map(a => a.event);
  events.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <EventCarousel title="Attended Events" description="" events={events} attendances={[]} />
    </div>
  );
};

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const handle = params?.handle as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const user = await UserAPI.getUserByHandle(token, handle);
    const attendances = await EventAPI.getAttendanceForUser(token, user.uuid);
    return {
      props: {
        user,
        attendances,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.homeRoute, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
