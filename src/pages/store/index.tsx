import { HelpModal, Hero, Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/store/index.module.scss';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

interface HomePageProps {
  user: PrivateProfile;
}
const StoreHomePage = ({ user: { credits } }: HomePageProps) => {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <div className={styles.container}>
      <Navbar balance={credits} />
      <Hero onHelp={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
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
