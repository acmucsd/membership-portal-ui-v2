import { config } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps, NextPage } from 'next';

const AdminPage: NextPage = () => {
  return (
    <div>
      <h1>Portal Admin Page</h1>
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
