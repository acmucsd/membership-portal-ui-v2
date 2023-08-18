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
      <Navbar balance={credits} />
      <h2>Items</h2>
      <section
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          margin: '32px 0',
        }}
      >
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/07789a16-8326-4edc-ad2d-fc6193cd1ee3.jpg"
          cost={42069}
          title="Nishant (not for sale)"
          href="/store/item/18d76c1d-0d77-40a5-81cf-a7438e89a117"
          outOfStock
        />
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/1a623af5-2d4c-47e5-89a9-6698cefc0249.png"
          cost={1000}
          title="This item has a long title that wraps over multiple lines"
          href="/store/item/17774f20-e04d-4ace-a6fc-8dfe9286eca7"
        />
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/a21d9a9d-0da5-479d-9183-9781be4f9daf.jpeg"
          cost={10}
          title="Critter"
          href="/store/item/1dc46f8b-1481-4dac-a3ff-b835c3d6de2b"
        />
      </section>
      <h2>Collections</h2>
      <section
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          margin: '32px 0',
        }}
      >
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/cf6ca1b7-cd3b-4da5-8d2b-28ea55084a06.png"
          title="The Crewmate Collection (from Among Us)"
          href="/store/collection/05b4bd51-4c0c-4c41-a2c7-d9202eeace8c"
          description="Visors, space suits, and everything you need to stay unnoticed on a cold, starlit spaceship."
        />
        <ItemCard
          image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/0fe091ce-2ada-46b1-86a8-1f416371a905.png"
          title="The Golden Bear Collection"
          href="/store/collection/d3b37fc6-5b44-4051-a6f8-fdacc3f8d3ab"
          description='Recently a meme was shared to our subeddit outlining a dismissive and disrespectful act that, often, many non-Berkeley students are guilty of. Please do not refer to Berkeley as "UCB." This is not the proper way to refer to the University of California&apos;s original and flagship campus. Cal, Berkeley or UC Berkeley are all proper and acceptable ways to say it. UCB, on the other hand, is not. As the system&apos;s most prestigious and respected campus, we feel that it is important to honor and maintain an appropriate level of respect for our university&apos;s name. We feel that "UCB" cheapens our brand and doesn&apos;t emphasize the incredible prestige associated with Berkeley. While it may be acceptable to refer to all other UC campuses in initialisms due to their lack of recognition and prestige, this is not acceptable for the flagship and most well-known campus, and we therefore request that you cease using the name "UCB" to refer our school. Thank you. TL:DR Don&apos;t say "UCB" when referring to Berkeley.'
        />
      </section>
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
