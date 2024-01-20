import { Typography } from '@/components/common';
import { ItemCard, Navbar } from '@/components/store';
import { config } from '@/lib';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from '@/styles/pages/store/collections.module.scss';
import { GetServerSideProps } from 'next';

interface CollectionProps {
  user: PrivateProfile;
  collection: PublicMerchCollection;
}

const CollectionsPage = ({
  user: { credits },
  collection: { title, description, items = [] },
}: CollectionProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} showBack />
      <div className={styles.header}>
        <Typography variant="h1/bold" component="h1">
          {title}
        </Typography>
        <Typography variant="h4/regular" component="p">
          {description}
        </Typography>
      </div>
      <div className={styles.collections}>
        {items.map(item => (
          <ItemCard
            image={getDefaultMerchItemPhoto(item)}
            title={item.itemName}
            href={`${config.itemRoute}${item.uuid}`}
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
  const collection = await StoreAPI.getCollection(token, uuid);
  return {
    props: {
      collection,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes
);
