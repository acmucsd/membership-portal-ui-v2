import { LinkButton, Typography } from '@/components/common';
import { config } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import type { GetServerSideProps } from 'next';

interface AdminProps {
  user: PrivateProfile;
  preview: string;
}

const AdminPage = ({ user: { accessType }, preview }: AdminProps) => {
  return (
    <div>
      <Typography variant="h1/bold">Admin Actions</Typography>
      <br />
      <Typography variant="h2/bold">Events</Typography>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1rem 0',
        }}
      >
        <LinkButton href={config.admin.events.homeRoute}>Manage Events</LinkButton>
      </div>
      <br />
      <Typography variant="h2/bold">Store</Typography>
      <label>
        <input
          type="checkbox"
          defaultChecked={preview === 'member'}
          onChange={e =>
            CookieService.setClientCookie(
              CookieType.PREVIEW,
              e.currentTarget.checked ? 'member' : 'admin'
            )
          }
        />{' '}
        Preview store as member
      </label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1rem 0',
        }}
      >
        <LinkButton href={config.store.homeRoute}>Manage Store Merchandise</LinkButton>
        <LinkButton href={config.admin.store.pickupEvents}>Manage Pickup Events</LinkButton>
      </div>
      <br />
      <Typography variant="h2/bold">User Points</Typography>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1rem 0',
        }}
      >
        {PermissionService.canAwardPoints.includes(accessType) ? (
          <>
            <LinkButton href={config.admin.awardPoints}>Award Bonus Points</LinkButton>
            <LinkButton href={config.admin.grantPastAttendance}>Grant Past Attendance</LinkButton>
            <LinkButton href={config.admin.awardMilestone}>Create Portal Milestone</LinkButton>
          </>
        ) : (
          'Restricted Access'
        )}
      </div>

      <Typography variant="h2/bold">User Accounts</Typography>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1rem 0',
        }}
      >
        {PermissionService.canViewResumes.includes(accessType) ? (
          <LinkButton href={config.admin.viewResumes}>View User Resumes</LinkButton>
        ) : (
          'Restricted Access'
        )}
      </div>
    </div>
  );
};

export default AdminPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const preview = CookieService.getServerCookie(CookieType.PREVIEW, { req, res }) ?? '';
  return {
    props: { preview },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canViewAdminPage,
  config.homeRoute
);
