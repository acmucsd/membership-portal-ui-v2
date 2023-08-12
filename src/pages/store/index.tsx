import { HelpModal, Hero, Navbar } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/store/index.module.scss';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

interface HomePageProps {
  user: PrivateProfile;
  collections: PublicMerchCollection[];
}
const StoreHomePage = ({ user: { credits }, collections }: HomePageProps) => {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <Navbar balance={credits} />
      </div>
      <Hero onHelp={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <div className={styles.container}>
        {collections.map(collection => (
          <pre key={collection.uuid}>{JSON.stringify(collection, null, 2)}</pre>
        ))}
      </div>
    </>
  );
};

export default StoreHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const collections = await StoreAPI.getAllCollections(AUTH_TOKEN);

  return {
    props: {
      collections,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
