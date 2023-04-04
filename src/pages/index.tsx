import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  user: PrivateProfile;
}

const PortalHomePage = ({ user }: HomePageProps) => {
  return (
    <div>
      <h1>Portal Home Page</h1>
      <pre>User Info: {JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
