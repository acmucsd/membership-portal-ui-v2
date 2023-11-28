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
import Link from 'next/link';
import { useState } from 'react';

type View = 'collections' | 'all-items';

interface HomePageProps {
  user: PrivateProfile;
  view: View;
  collections: PublicMerchCollection[];
}
const StoreHomePage = ({ user: { credits }, view, collections }: HomePageProps) => {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <Navbar balance={credits} />
      </div>
      <Hero onHelp={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{view === 'collections' ? 'Browse our collections' : 'Browse all items'}</h2>
          <Link
            className={styles.viewToggle}
            href={view === 'collections' ? `${config.storeRoute}?view=all` : config.storeRoute}
            scroll={false}
          >
            {view === 'collections' ? 'See all items' : 'See collections'}
          </Link>
        </div>
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

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const collections = await StoreAPI.getAllCollections(AUTH_TOKEN);

  return {
    props: {
      view: query.view === 'all' ? 'all-items' : 'collections',
      collections,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
