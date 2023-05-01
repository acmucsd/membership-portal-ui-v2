import { config } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

const AdminPage: NextPage = () => {
  return (
    <div>
      <h1>Portal Admin Page</h1>
      <Link href="/admin/create-event">Create New Event</Link>
    </div>
  );
};

export default AdminPage;

const getServerSidePropsFunc: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canViewAdminPage(),
  config.homeRoute
);
