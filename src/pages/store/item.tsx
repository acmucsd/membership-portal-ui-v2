import { Navbar } from '@/components/store';
import SizeSelector from '@/components/store/SizeSelector';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { GetServerSideProps } from 'next';

interface ItemPageProps {
  user: PrivateProfile;
}
const StoreItemPage = ({ user: { credits } }: ItemPageProps) => {
  return (
    <>
      <Navbar balance={credits} showBack />
      <h1>Store Item Page</h1>
      <SizeSelector />
    </>
  );
};

export default StoreItemPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
