import {
  CollectionSlider,
  EditButton,
  HelpModal,
  Hero,
  HiddenIcon,
  ItemCard,
  Navbar,
} from '@/components/store';
import CreateButton from '@/components/store/CreateButton';
import { config, showToast } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from '@/styles/pages/StoreHomePage.module.scss';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type View = 'collections' | 'all-items';

function getPath(view: View): string {
  const params = new URLSearchParams();
  if (view === 'all-items') {
    params.set('view', 'all');
  }
  const query = params.toString();
  return query ? `${config.store.homeRoute}?${query}` : config.store.homeRoute;
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
  const router = useRouter();

  const [helpOpen, setHelpOpen] = useState(false);

  const canManageStore = PermissionService.canEditMerchItems.includes(accessType) && !previewPublic;

  const visibleCollections = collections.filter(
    collection => canManageStore || !collection.archived
  );

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
            <button
              type="button"
              className={styles.viewToggle}
              onClick={() => {
                CookieService.setClientCookie(CookieType.PREVIEW, 'member');
                showToast(
                  'Previewing store as member',
                  'To re-enable admin store options, go to admin settings.',
                  [
                    {
                      text: 'Admin settings',
                      onClick: () => router.push(config.admin.homeRoute),
                    },
                  ]
                );
                router.replace(config.store.homeRoute);
              }}
            >
              View store as member
            </button>
          )}
          <Link
            className={styles.viewToggle}
            href={getPath(view === 'collections' ? 'all-items' : 'collections')}
            scroll={false}
          >
            {view === 'collections' ? 'See all items' : 'See collections'}
          </Link>
        </div>
        {view === 'collections' ? (
          <div className={styles.collections}>
            {visibleCollections.map(collection => (
              <ItemCard
                image={getDefaultMerchItemPhoto(collection.items[0])}
                title={collection.title}
                description={collection.description}
                href={`${config.store.collectionRoute}${collection.uuid}`}
                key={collection.uuid}
              >
                {canManageStore && collection.archived && <HiddenIcon type="collection" />}
                {canManageStore && <EditButton type="collection" uuid={collection.uuid} />}
              </ItemCard>
            ))}
            {canManageStore && <CreateButton type="collection">Create a collection</CreateButton>}
          </div>
        ) : (
          <>
            {visibleCollections.map(collection => (
              <CollectionSlider
                uuid={collection.uuid}
                title={collection.title}
                description={collection.description}
                items={collection.items}
                canManageStore={canManageStore}
                isHidden={canManageStore && collection.archived}
                key={collection.uuid}
              />
            ))}
            {canManageStore && (
              <CreateButton type="collection" horizontal>
                Create a collection
              </CreateButton>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default StoreHomePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const preview = CookieService.getServerCookie(CookieType.PREVIEW, { req, res });

  const collections = await StoreAPI.getAllCollections(AUTH_TOKEN);

  return {
    props: {
      view: query.view === 'all' ? 'all-items' : 'collections',
      collections,
      previewPublic: preview === 'member',
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
