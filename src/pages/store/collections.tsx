import { Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PublicMerchCollection } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/leaderboard.module.scss';
import { GetServerSideProps } from 'next';

interface CollectionProps {
  collection: PublicMerchCollection;
}

/* component for each row, one collection = one row
component for each item 
for each collection: map it into a row
for each row: map merch items in
*/
const CollectionsPage = ({ collection: { title, description } }: CollectionProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={0} />
      <div className={styles.header}>
        <h2 className={styles.heading}>`${title}`</h2>
        <p>`${description}`</p>
      </div>
    </div>
  );
};

export default CollectionsPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
