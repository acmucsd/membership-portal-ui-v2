import { config } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

const UserProfilePage: NextPage = () => {
  return (
    <>
      <h1>Portal Profile Page</h1>
      <Link href={config.profile.editRoute} style={{ color: '#62b0ff' }}>
        Edit profile
      </Link>
    </>
  );
};

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
