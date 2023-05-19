import { TopThreeCard } from '@/components/leaderboard';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const LeaderboardPage = () => {
  return (
    <div>
      <TopThreeCard
        position={3}
        rank="Polynomial Pita"
        name="Faris Ashi"
        points={225}
        image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/c7911ea6-0398-4697-96ff-d352601830e8.png"
      />
      <TopThreeCard
        position={2}
        rank="Fraction"
        name="alfjksfioirjkljkhjjdflasjflksjdfkljsfklsjfklsjfslkfjls"
        points={305}
        image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/c7911ea6-0398-4697-96ff-d352601830e8.png"
      />
      <TopThreeCard
        position={1}
        rank="Polynomial Pita"
        name="Joe Politz"
        points={225}
        image="https://acmucsd.s3.us-west-1.amazonaws.com/portal/profiles/c7911ea6-0398-4697-96ff-d352601830e8.png"
      />
    </div>
  );
};

export default LeaderboardPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
