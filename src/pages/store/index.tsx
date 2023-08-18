import { Title } from '@/components/common';
import { CollectionSlider, HelpModal, Hero, ItemCard, Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import NoImage from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/store/index.module.scss';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

type View = 'collections' | 'all-items';

interface HomePageProps {
  user: PrivateProfile;
  collections: PublicMerchCollection[];
}
const StoreHomePage = ({ user: { credits }, collections }: HomePageProps) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [view, setView] = useState<View>('collections');

  return (
    <>
      <div className={styles.container}>
        <Navbar balance={credits} />
      </div>
      <Hero onHelp={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <div className={styles.container}>
        <Title
          type="h2"
          heading={view === 'collections' ? 'Browse our collections' : 'Browse all items'}
          className={styles.header}
        >
          <button
            type="button"
            className={styles.viewToggle}
            onClick={() => setView(view === 'collections' ? 'all-items' : 'collections')}
          >
            {view === 'collections' ? 'See all items' : 'See collections'}
          </button>
        </Title>
        {view === 'collections' ? (
          <div className={styles.collections}>
            {collections.map(collection => (
              <ItemCard
                image={collection.items[0]?.picture ?? NoImage.src}
                title={collection.title}
                description={collection.description}
                href={`${config.collectionRoute}${collection.uuid}`}
                key={collection.uuid}
              />
            ))}
          </div>
        ) : (
          collections.map(collection => (
            <CollectionSlider
              title={collection.title}
              description={collection.description}
              items={collection.items}
              key={collection.uuid}
            />
          ))
        )}
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
