import { Title } from '@/components/common';
import { HelpModal, Hero, ItemCard, Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import NoImage from '@/public/assets/acm-logos/general/light-mode.png';
import styles from '@/styles/pages/store/index.module.scss';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

function getCollectionThumbnail(collection: PublicMerchCollection): string {
  // TEMP. Also, eslint(no-restricted-syntax) says I can't use for-of loops,
  // eslint(no-plusplus) says no i++, and noUncheckedIndexedAccess is set to
  // true so `item` is potentially undefined.
  for (let i = 0; i < collection.items.length; i += 1) {
    const item = collection.items[i];
    if (item && !item.picture.startsWith('https://i.imgur.com/')) {
      return item.picture;
    }
  }
  return NoImage.src;
}

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
        <Title type="h2" heading="Browse our collections">
          <button type="button" className={styles.viewToggle}>
            See all items
          </button>
        </Title>
        <div className={styles.collections}>
          {collections.map(collection => (
            <ItemCard
              image={getCollectionThumbnail(collection)}
              title={collection.title}
              description={collection.description}
              href={`${config.collectionRoute}${collection.uuid}`}
              key={collection.uuid}
            />
          ))}
        </div>
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
      collections: [...collections],
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
