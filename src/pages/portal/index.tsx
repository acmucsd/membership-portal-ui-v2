import protectPage from '@/lib/hoc/protectPage';
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
      {/* Temporary data display */}
      <pre>User Info: {JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default PortalHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = protectPage(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
