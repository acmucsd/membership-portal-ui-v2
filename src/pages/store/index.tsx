import { ItemCard, Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const StoreHomePage = () => {
  return (
    <>
      <Navbar backUrl="/" />
      <ItemCard
        image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/07789a16-8326-4edc-ad2d-fc6193cd1ee3.jpg"
        cost={42069}
        title="Nishant (not for sale)"
        href="/leaderboard"
        inStock={false}
      />
    </>
  );
};

export default StoreHomePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
