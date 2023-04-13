import { SignInButton } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import Cat404 from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/404.module.scss';
import Image from 'next/image';

const PageNotFound = () => (
  <VerticalForm style={{ alignItems: 'center' }}>
    <h1 className={styles.header}>Whoops, we entered up on the wrong page!</h1>
    <Image src={Cat404} width={256} height={256} alt="Sad Cat" />
    <SignInButton type="link" display="button1" href="/" text="Return to Home" />
  </VerticalForm>
);

export default PageNotFound;
