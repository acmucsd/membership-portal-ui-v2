import { ItemCard, Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import NoImage from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/store/collections.module.scss';
import { GetServerSideProps } from 'next';

interface CollectionProps {
  collection: PublicMerchCollection;
}

/* component for each row, one collection = one row
component for each item 
for each collection: map it into a row
for each row: map merch items in
*/
const CollectionsPage = ({ collection: { title, description, items = [] } }: CollectionProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={0} />
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.collections}>
        {items.map(item => (
          <ItemCard
            className={styles.card}
            image={item.picture ?? NoImage.src}
            title={item.itemName}
            href={`${config.store.itemRoute}${item.uuid}`}
            cost={item.options[0]?.price ?? 0}
            key={item.uuid}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const uuid = params?.uuid as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const collection = await StoreAPI.getCollection(uuid, token);
  return {
    props: {
      collection,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
