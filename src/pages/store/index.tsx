import { CollectionSlider, HelpModal, Hero, ItemCard, Navbar } from '@/components/store';
import CreateItemCard from '@/components/store/CreateItemCard';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from '@/styles/pages/StoreHomePage.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

type View = 'collections' | 'all-items';

function getPath(view: View, previewPublic: boolean): string {
  const params = new URLSearchParams();
  if (view === 'all-items') {
    params.set('view', 'all');
  }
  if (previewPublic) {
    params.set('preview', 'public');
  }
  return params.size > 0 ? `${config.store.homeRoute}?${params}` : config.store.homeRoute;
}

interface HomePageProps {
  user: PrivateProfile;
  view: View;
  collections: PublicMerchCollection[];
  previewPublic: boolean;
}
const StoreHomePage = ({
  user: { credits, accessType },
  view,
  collections,
  previewPublic,
}: HomePageProps) => {
  const [helpOpen, setHelpOpen] = useState(false);

  const canManageStore = PermissionService.canEditMerchItems.includes(accessType) && !previewPublic;

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
          {canManageStore && (
            <Link className={styles.viewToggle} href={getPath(view, true)}>
              View store as member
            </Link>
          )}
          <Link
            className={styles.viewToggle}
            href={getPath(view === 'collections' ? 'all-items' : 'collections', previewPublic)}
            scroll={false}
          >
            {view === 'collections' ? 'See all items' : 'See collections'}
          </Link>
        </div>
        {view === 'collections' ? (
          <div className={styles.collections}>
            {collections.map(collection => (
              <ItemCard
                image={getDefaultMerchItemPhoto(collection.items[0])}
                title={collection.title}
                description={collection.description}
                href={`${config.store.collectionRoute}${collection.uuid}`}
                editUrl={
                  canManageStore ? `${config.store.collectionRoute}${collection.uuid}/edit` : null
                }
                key={collection.uuid}
              />
            ))}
            {canManageStore && (
              <CreateItemCard
                href={config.store.createCollectionRoute}
                label="Create a collection"
              />
            )}
          </div>
        ) : (
          <>
            {collections.map(collection => (
              <CollectionSlider
                uuid={collection.uuid}
                title={collection.title}
                description={collection.description}
                items={collection.items}
                editUrl={
                  canManageStore ? `${config.store.collectionRoute}${collection.uuid}/edit` : null
                }
                key={collection.uuid}
              />
            ))}
            <Link className={styles.createCollection} href={config.store.createCollectionRoute}>
              <BsPlus aria-hidden />
              Create a collection
            </Link>
          </>
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
      previewPublic: query.preview === 'public',
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
