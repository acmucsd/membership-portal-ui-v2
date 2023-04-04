import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps } from 'next';

const AboutPage = () => {
  return <h1>About ACM Page</h1>;
};

export default AboutPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
