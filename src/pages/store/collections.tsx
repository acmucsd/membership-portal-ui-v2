import { ItemCard } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const CollectionsPage = () => {
  return (
    <div>
      <h1>The Cozy Collection</h1>
      <p> Sweaters, hoodies, and everything you need to stay warm on a cold night. </p>
      <ItemCard
        image="@/public/assets/graphics/cat404.png"
        title="The Cozy Collection"
        href="/store/collection/05b4bd51-4c0c-4c41-a2c7-d9202eeace8c"
        description="Warm hoodies and sweaters to keep you warm in the chilly weather!"
      />
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
