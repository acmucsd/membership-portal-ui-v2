import { Navbar } from '@/components/store';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import HeroDeco1 from '@/public/assets/graphics/store/hero-deco1.svg';
import HeroDeco2 from '@/public/assets/graphics/store/hero-deco2.svg';
import HeroHeading from '@/public/assets/graphics/store/hero-heading.svg';
import HeroPhoto from '@/public/assets/graphics/store/hero-photo.jpg';
import styles from '@/styles/pages/store/index.module.scss';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

interface HomePageProps {
  user: PrivateProfile;
}
const StoreHomePage = ({ user: { credits } }: HomePageProps) => {
  return (
    <div className={styles.container}>
      <Navbar balance={credits} />
      <div className={styles.hero}>
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            <Image
              src={HeroPhoto}
              alt="A crowd of ACM members holding up ACM diamond shapes with their fingers."
              fill
            />
          </div>
        </div>
        <div className={styles.right}>
          <HeroDeco1 className={styles.deco1} alt="Various decorative snowflakes" aria-hidden />
          <div className={styles.heroContent}>
            <h1 className={styles.heading}>
              <HeroHeading alt="The ACM Store" />
            </h1>
            <p className={styles.description}>
              Shop the ACM Store for exclusive ACM merchandise including shirts, hoodies, pop
              sockets & more!
            </p>
            <button type="button" className={styles.textButton}>
              How does the ACM Store work?
            </button>
          </div>
          <HeroDeco2 className={styles.deco2} alt="Various decorative sparkles" aria-hidden />
        </div>
      </div>
    </div>
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
