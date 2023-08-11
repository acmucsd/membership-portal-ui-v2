import { ItemCard, Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { GetServerSideProps } from 'next';

interface HomePageProps {
  user: PrivateProfile;
}
const StoreHomePage = ({ user: { credits } }: HomePageProps) => {
  // TEMP, just to demo the components
  return (
    <>
      <Navbar balance={credits} backUrl="/" />
      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          marginTop: '32px',
        }}
      >
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/07789a16-8326-4edc-ad2d-fc6193cd1ee3.jpg"
          cost={42069}
          title="Nishant (not for sale)"
          href="/leaderboard"
          inStock={false}
        />
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/a21d9a9d-0da5-479d-9183-9781be4f9daf.jpeg"
          cost={10}
          title="Critter"
        />
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/cf6ca1b7-cd3b-4da5-8d2b-28ea55084a06.png"
          title="The Crewmate Collection"
          description="Visors, space suits, and everything you need to stay unnoticed on a cold, starlit spaceship."
        />
      </div>
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
