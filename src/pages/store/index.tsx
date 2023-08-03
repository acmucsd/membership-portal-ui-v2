import { Hero, Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/store/index.module.scss';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  user: PrivateProfile;
}
const StoreHomePage = ({ user: { credits } }: HomePageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} />
      <Hero />
    </div>
  );
};

export default StoreHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
