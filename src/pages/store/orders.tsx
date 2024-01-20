import { Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { GetServerSideProps } from 'next';

interface OrderPageProps {
  user: PrivateProfile;
}
const StoreOrderPage = ({ user: { credits } }: OrderPageProps) => {
  return (
    <>
      <Navbar balance={credits} showBack />
      <h1>Store Order Page</h1>
    </>
  );
};

export default StoreOrderPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
