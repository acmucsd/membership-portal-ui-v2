import { SignInButton } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { Navbar } from '@/components/store';
import { config } from '@/lib';
import { PrivateProfile } from '@/lib/types/apiResponses';
import Cat404 from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/404.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface PageNotFoundProps {
  user?: PrivateProfile;
}

const PageNotFound = ({ user }: PageNotFoundProps) => {
  const router = useRouter();
  return (
    <>
      {user && router.asPath.startsWith(config.storeRoute) && (
        <Navbar balance={user.credits} showBack />
      )}
      <VerticalForm style={{ alignItems: 'center' }}>
        <h1 className={styles.header}>Whoops, we entered up on the wrong page!</h1>
        <Image src={Cat404} width={256} height={256} alt="Sad Cat" />
        <SignInButton type="link" display="button1" href="/" text="Return to Home" />
      </VerticalForm>
    </>
  );
};

export default PageNotFound;
